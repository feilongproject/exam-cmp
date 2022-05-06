export { }


declare global {

    interface ExamStudent {
        name: string,
        total: number,
        rank: number,
        //schoolRank: number,
    }

    interface storageChoice {
        choice1: {
            name: number,
            total: number,
            rank: number,
        },
        choice2: {
            name: number,
            total: number,
            rank: number,
        },
    }
}


