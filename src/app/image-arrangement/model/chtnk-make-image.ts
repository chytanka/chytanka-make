export interface IChtnkMakeImage {
    sha256: string
    src: string
    name: string
}

export class ChtnkMakeImage implements IChtnkMakeImage {
    sha256: string
    src: string
    name: string
    
    constructor(src: string, name: string, sha256: string) {
        this.src = src;
        this.name = name;
        this.sha256 = sha256
    }
}