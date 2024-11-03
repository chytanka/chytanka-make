export interface ComicInfo {
    general: {
        title: string,
        series: string,
        number: string,
        volume: string,
        summary: string
    },
    creators: {
        writer: string;
        penciller: string;
        inker: string;
        colorist: string;
        coverArtist: string;
    },
    publication: {
        publisher: string;
        year: string;
        month: string;
        day: string;
    },
    technical: {
        pageCount: string;
        languageISO: string;
        manga: string,
    },
    additional: {
        characters: string;
        teams: string;
        locations: string;
        storyArc: string;
        scanInformation: string;
    }
}