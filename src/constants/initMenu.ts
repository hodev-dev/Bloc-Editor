const initialMenu: Array<any> = [
    {
        title: "tech",
        type: 'D',
        sub: [
            {
                title: 'phone',
                type: 'D',
                sub: [
                    {
                        title: 'galaxy',
                        type: 'D',
                        sub: [
                            {
                                title: "A series",
                                type: 'D',
                                sub: []
                            },
                            {
                                title: "S series",
                                type: 'D',
                                sub: []
                            },
                        ]
                    },
                    {
                        title: 'iphone',
                        type: 'D',
                        sub: []
                    },
                ]
            },
            {
                title: 'computers',
                type: 'D',
                sub: []
            },
        ]
    },
    {
        title: "book",
        type: 'D',
        sub: [
            {
                title: 'drama',
                type: 'D',
                sub: []
            },
            {
                title: 'sifi',
                type: 'D',
                sub: []
            }
        ]
    },
    {
        title: "video",
        type: 'F',
        sub: []
    },
    {
        title: "last",
        type: 'D',
        sub: []
    },
];

export default initialMenu;