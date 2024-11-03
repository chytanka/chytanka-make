import { Command } from "./command";

export class CommandManager {
  private _history: Command[] = [];
  private _undoneCommands: Command[] = [];

  public get history(): Command[] {
    return this._history;
  }

  public get undoneCommands(): Command[] {
    return this._undoneCommands
  }

  executeCommand(command: Command): void {
    command.execute();
    this._history.push(command);

    this._undoneCommands = [];
  }

  async undo(): Promise<void> {
    const command = this.history.pop();
    if (command) {
      await Promise.resolve(command.unexecute());
      this._undoneCommands.push(command);
    }
  }

  async redo(): Promise<void> {
    const command = this.undoneCommands.pop();
    if (command) {
      await Promise.resolve(command.execute());
      this._history.push(command);
    }
  }
}