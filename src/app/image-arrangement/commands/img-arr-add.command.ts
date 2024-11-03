import { WritableSignal } from "@angular/core";
import { Command } from "../../shared/command";
import { IChtnkMakeImage } from "../model/chtnk-make-image";

export class ImgArrangeAddCommand implements Command {
    name: string = "ImgArrangeAddCommand";
    constructor(
        private imageList: WritableSignal<IChtnkMakeImage[]>,
        private imageItem: IChtnkMakeImage
    ) { 
        
    }

    execute(): void {
        this.imageList.update(values => [...values, this.imageItem]);
        this.name = `➕ Add ${this.imageItem.name}`
    }

    unexecute(): void {
        this.imageList.update((items) => items.filter((i) => i.sha256 !== this.imageItem.sha256));
    }

    toString() {
        return this.name
    }
}