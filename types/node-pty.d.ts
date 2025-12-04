/**
 * Type declarations for node-pty
 * node-pty is an optional dependency that provides pseudo-terminal (PTY) functionality.
 * These types allow TypeScript compilation to succeed even when the package isn't installed.
 */

declare module "node-pty" {
  export interface IPtyForkOptions {
    name?: string;
    cols?: number;
    rows?: number;
    cwd?: string;
    env?: { [key: string]: string | undefined };
    encoding?: string | null;
    handleFlowControl?: boolean;
    flowControlPause?: string;
    flowControlResume?: string;
  }

  export interface IDisposable {
    dispose(): void;
  }

  export interface IPty {
    readonly pid: number;
    readonly cols: number;
    readonly rows: number;
    readonly process: string;
    readonly handleFlowControl: boolean;

    onData: IEvent<string>;
    onExit: IEvent<{ exitCode: number; signal?: number }>;

    on(event: "data", listener: (data: string) => void): void;
    on(
      event: "exit",
      listener: (exitCode: number, signal?: number) => void
    ): void;
    on(event: "error", listener: (err: Error) => void): void;

    resize(columns: number, rows: number): void;
    clear(): void;
    write(data: string): void;
    kill(signal?: string): void;
    pause(): void;
    resume(): void;
  }

  export type IEvent<T> = (listener: (e: T) => void) => IDisposable;

  export function spawn(
    file: string,
    args: string[] | string,
    options: IPtyForkOptions
  ): IPty;
}
