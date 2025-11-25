// Heuristic fixer for node-pty Windows sources when patch-package isn't available
// - Ensures PFN* typedefs for ConPTY are defined even when PROC_THREAD_ATTRIBUTE_PSEUDOCONSOLE
//   is already defined by the SDK (avoids undeclared identifier errors)
// - Hoists winpty variable declarations in winpty.cc to avoid MSVC C2362 (goto skipping init)
// - No-op if node-pty is not installed; idempotent when re-run

const fs = require("fs");
const path = require("path");

function safeRead(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function safeWrite(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, "utf8");
}

(function main() {
  const root = process.cwd();

  // 1) Patch conpty.cc to add PFN typedefs regardless of PROC_THREAD_ATTRIBUTE_PSEUDOCONSOLE
  try {
    const conptyPath = path.join(
      root,
      "node_modules",
      "node-pty",
      "src",
      "win",
      "conpty.cc"
    );
    const content = safeRead(conptyPath);
    if (content) {
      const guardStart = "// BEGIN: injected typedef guards for PFN* (auto)";
      if (!content.includes(guardStart)) {
        // Find insertion after the last #include to keep things tidy
        const includeRegex = /^(#include\s+.+)$/gm;
        let lastMatch = null;
        let m;
        while ((m = includeRegex.exec(content)) !== null) {
          lastMatch = m;
        }
        const insertAt = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
        const injection = `\n\n${guardStart}\n#ifndef PFNCREATEPSEUDOCONSOLE\n  typedef HRESULT (__stdcall *PFNCREATEPSEUDOCONSOLE)(COORD c, HANDLE hIn, HANDLE hOut, DWORD dwFlags, HPCON* phpcon);\n#endif\n#ifndef PFNRESIZEPSEUDOCONSOLE\n  typedef HRESULT (__stdcall *PFNRESIZEPSEUDOCONSOLE)(HPCON hpc, COORD newSize);\n#endif\n#ifndef PFNCLEARPSEUDOCONSOLE\n  typedef HRESULT (__stdcall *PFNCLEARPSEUDOCONSOLE)(HPCON hpc);\n#endif\n#ifndef PFNCLOSEPSEUDOCONSOLE\n  typedef void (__stdcall *PFNCLOSEPSEUDOCONSOLE)(HPCON hpc);\n#endif\n#ifndef PFNRELEASEPSEUDOCONSOLE\n  typedef void (__stdcall *PFNRELEASEPSEUDOCONSOLE)(HPCON hpc);\n#endif\n// END: injected typedef guards for PFN* (auto)\n\n`;
        const updated =
          content.slice(0, insertAt) + injection + content.slice(insertAt);
        safeWrite(conptyPath, updated);
      }
    }
  } catch {}

  // 2) Patch winpty.cc to hoist variable declarations in PtyStartProcess
  try {
    const winptyPath = path.join(
      root,
      "node_modules",
      "node-pty",
      "src",
      "win",
      "winpty.cc"
    );
    let wcontent = safeRead(winptyPath);
    if (wcontent && wcontent.includes("static NAN_METHOD(PtyStartProcess)")) {
      const funcStart = wcontent.indexOf("static NAN_METHOD(PtyStartProcess)");
      const braceOpen = wcontent.indexOf("{", funcStart);
      if (braceOpen !== -1) {
        // Find matching closing brace for the function via a simple counter
        let i = braceOpen + 1,
          depth = 1;
        while (i < wcontent.length && depth > 0) {
          if (wcontent[i] === "{") depth++;
          else if (wcontent[i] === "}") depth--;
          i++;
        }
        const funcEnd = i; // position after closing brace
        const before = wcontent.slice(0, braceOpen + 1);
        const body = wcontent.slice(braceOpen + 1, funcEnd - 1);
        const after = wcontent.slice(funcEnd - 1);

        const hoistBlockStartMarker =
          "// BEGIN: injected hoisted declarations (auto)";
        if (!body.includes(hoistBlockStartMarker)) {
          // Replace declarations with assignments within the original function body
          let transformedBody = body;
          const replacements = [
            { from: /\bint\s+cols\s*=\s*/g, to: "cols = " },
            { from: /\bint\s+rows\s*=\s*/g, to: "rows = " },
            { from: /\bbool\s+debug\s*=\s*/g, to: "debug = " },
            {
              from: /\bwinpty_error_ptr_t\s+error_ptr\s*=\s*/g,
              to: "error_ptr = ",
            },
            {
              from: /\bwinpty_config_t\*\s+winpty_config\s*=\s*/g,
              to: "winpty_config = ",
            },
            { from: /\bwinpty_t\s*\*\s*pc\s*=\s*/g, to: "pc = " },
            {
              from: /\bwinpty_spawn_config_t\*\s+config\s*=\s*/g,
              to: "config = ",
            },
            { from: /\bHANDLE\s+handle\s*=\s*/g, to: "handle = " },
            { from: /\bBOOL\s+spawnSuccess\s*=\s*/g, to: "spawnSuccess = " },
            {
              from: /\bv8::Local<\s*v8::Object\s*>\s+marshal\s*=\s*/g,
              to: "marshal = ",
            },
          ];
          for (const r of replacements) {
            transformedBody = transformedBody.replace(r.from, r.to);
          }
          // Insert hoisted declarations at the top of the transformed body
          const hoisted = `\n  ${hoistBlockStartMarker}\n  int cols = 0;\n  int rows = 0;\n  bool debug = false;\n  winpty_error_ptr_t error_ptr = nullptr;\n  winpty_config_t* winpty_config = nullptr;\n  winpty_t *pc = nullptr;\n  winpty_spawn_config_t* config = nullptr;\n  HANDLE handle = nullptr;\n  BOOL spawnSuccess = 0;\n  v8::Local<v8::Object> marshal;\n  // END: injected hoisted declarations (auto)\n\n`;
          const newBody = hoisted + transformedBody;

          wcontent = before + newBody + after;
          safeWrite(winptyPath, wcontent);
        }
      }
    }
  } catch {}
})();
