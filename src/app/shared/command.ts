export interface Command {
    name: string
    execute(): void;
    unexecute(): void;
}