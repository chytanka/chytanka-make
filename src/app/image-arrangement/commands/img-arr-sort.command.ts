import { WritableSignal } from "@angular/core";
import { Command } from "../../shared/command";
import { IChtnkMakeImage } from "../model/chtnk-make-image";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { createSortPredicate } from "sort-predicate";


export class ImgArrangeSortCommand implements Command {
    private readonly byName = createSortPredicate<IChtnkMakeImage>("name")
    name: string = "ImgArrangeSortCommand";

    unsortedArray: IChtnkMakeImage[] = []

    constructor(
        private array: WritableSignal<IChtnkMakeImage[]>,
    ) { }

    execute(): void {
        this.unsortedArray = [...this.array()];
        this.array.update(values => values.sort(this.byName))
        this.name = `🔠 List sorted by name`
    }

    unexecute(): void {
        this.array.set(this.unsortedArray)
    }

    toString() {
        return this.name
    }
}