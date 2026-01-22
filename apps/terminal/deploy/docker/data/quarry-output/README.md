# Quarry Output Directory

This directory stores files generated during terminal demo sessions.

## Structure

```
data/quarry-output/
├── <session-uuid-1>/
│   ├── output.json
│   └── report.html
├── <session-uuid-2>/
│   └── data.csv
└── ...
```

## Lifecycle

1. **Created:** When a WebSocket connection is established
2. **Used:** Quarry writes output files here during the session
3. **Deleted:** When the WebSocket connection closes (session ends)

## Security

- Each session has an isolated directory
- Directories are cleaned up on session disconnect
- Daily container restart clears any orphaned data
- Files are only accessible via authenticated session ID

## Local Development

This directory is empty in the repository. On the VPS, create it with:

```bash
mkdir -p data/quarry-output
chmod 755 data/quarry-output
```
