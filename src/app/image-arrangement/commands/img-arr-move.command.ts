import { WritableSignal } from "@angular/core";
import { Command } from "../../shared/command";
import { IChtnkMakeImage } from "../model/chtnk-make-image";
import { moveItemInArray } from "@angular/cdk/drag-drop";

export class ImgArrangeMoveCommand implements Command {
    name: string = "ImgArrangeMoveCommand";

    constructor(
        private array: WritableSignal<IChtnkMakeImage[]>,
        private fromIndex: number,
        private toIndex: number
    ) { }

    execute(): void {
        moveItemInArray(this.array(), this.fromIndex, this.toIndex);
        this.name = `🔄 Move item from ${this.fromIndex} to ${this.toIndex}`
    }

    unexecute(): void {
        moveItemInArray(this.array(), this.toIndex, this.fromIndex);
    }

    toString() {
        return this.name
    }
}