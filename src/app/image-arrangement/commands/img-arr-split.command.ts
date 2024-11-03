import { inject, WritableSignal } from "@angular/core";
import { Command } from "../../shared/command";
import { IChtnkMakeImage } from "../model/chtnk-make-image";
import { FileHashService } from "../../shared/file-hash.service";


export class ImgArrangeSplitCommand implements Command {
    name: string = "ImgArrangeSplitCommand";

    private image!: IChtnkMakeImage

    constructor(
        private array: WritableSignal<IChtnkMakeImage[]>,
        private index: number,
        private dir: string
    ) {
        this.image = this.array()[index];
    }

    execute(): void {
        this.splitImage()
        this.name = `✂️ Image ${this.image.name} was splited`
    }

    unexecute(): void {
        this.array.update((items) => items.filter((i) =>
            i.sha256 !== this.image.sha256
            && i.sha256 !== this.image.sha256 + "_2"
        ));
       

        this.array.update(values => {
            const l = values.slice(0, this.index)
            const r = values.slice(this.index, values.length)
            return [...l, this.image, ...r]
        })
    }

    toString() {
        return this.name
    }


    splitImage() {

        const img = new Image();
        img.src = this.image.src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Canvas context is not supported');
                return;
            }

            // Розрізати зображення навпіл
            const halfWidth = img.width / 2;
            const height = img.height;

            // Canvas для першої половини
            canvas.width = halfWidth;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, halfWidth, height, 0, 0, halfWidth, height);
            canvas.toBlob(async blob1 => {
                if (!blob1) return;

                const half1 = {
                    sha256: this.image.sha256,//this.fHash.getSHA256(await blob1.arrayBuffer()), // Функція для генерування sha256
                    src: URL.createObjectURL(blob1),
                    name: `half1_${this.image.name}`
                };

                // Canvas для другої половини
                ctx.clearRect(0, 0, halfWidth, height);
                ctx.drawImage(img, halfWidth, 0, halfWidth, height, 0, 0, halfWidth, height);
                canvas.toBlob(async blob2 => {
                    if (!blob2) return;

                    const half2 = {
                        sha256: this.image.sha256 + "_2",//this.fHash.getSHA256(await blob2.arrayBuffer()),
                        src: URL.createObjectURL(blob2),
                        name: `half2_${this.image.name}`
                    };

                    // this.removeImageBySha256(this.image.sha256)
                    this.array.update((items) => items.filter((i) => i.sha256 !== this.image.sha256));

                    const insert =
                        (this.dir == "ltr")

                            ? [half1, half2] : [half2, half1]
                    // Вставити нові зображення в масив
                    this.array.update(values => {
                        const l = values.slice(0, this.index)
                        const r = values.slice(this.index, values.length)
                        return [...l, ...insert, ...r]
                    })
                });
            });
        };
    }

}