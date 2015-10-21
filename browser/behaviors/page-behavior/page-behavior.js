App.Behaviors.PageBehavior = {
    properties: {
        pages: {
            type: Object,
            value: [
                {
                    'tag': '/home/',
                    'title': 'Home',
                    'element': 'page-home'
                },
                {
                    'tag': '/about/',
                    'title': 'About',
                    'element': 'page-about'
                }
            ],
            readOnly: true
        }
    }
};
