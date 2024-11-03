import { WritableSignal } from "@angular/core";
import { Command } from "../../shared/command";
import { IChtnkMakeImage } from "../model/chtnk-make-image";

export class ImgArrangeRemoveCommand implements Command {
    private removedItem?: IChtnkMakeImage;
    private index?: number;
    name: string = "ImgArrangeRemoveCommand";

    constructor(
        private imageList: WritableSignal<IChtnkMakeImage[]>,
        private sha256: string
    ) {

    }

    execute(): void {
        this.removedItem = this.imageList().find(image => image.sha256 === this.sha256);

        if (!this.removedItem) return;
        this.index = this.imageList().indexOf(this.removedItem)
        this.imageList.update((items) => items.filter((i) => i.sha256 !== this.sha256));
        this.name = `🗑️ Remove ${this.removedItem.name}`
    }

    unexecute(): void {
        if (this.removedItem == undefined) return

        this.imageList.update(values => {
            const l = values.slice(0, this.index)
            const r = values.slice(this.index, values.length)
            return [...l, this.removedItem as IChtnkMakeImage, ...r]
        })
    }

    toString() {
        return this.name
    }
}