class database {
    constructor(mongoose) {
        /***************************\
        *    TOP-ARTICLE SCHEMA    *
        \***************************/

        this.ArticleSchema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'articles'
        });

        this.Article_Model = new mongoose.model("Article", this.ArticleSchema);

        /***************************\
        *    POLITICS SCHEMA       *
        \***************************/

        this.Politics_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_politics'
        });

        this.Politic_Model = new mongoose.model("Category_politics", this.Politics_Schema);

        /***************************\
        *    TECHNOLOGY SCHEMA     *
        \***************************/

        this.Technology_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_technology'
        });

        this.Technology_Model = new mongoose.model("Category_technology", this.Technology_Schema);



        /***************************\
        *    LIFESTYLE SCHEMA      *
        \***************************/


        this.Lifestyle_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_lifestyle'
        });

        this.Lifestyle_Model = new mongoose.model("Category_lifestyle", this.Lifestyle_Schema);


        /***************************\
        *    ECONOMY SCHEMA        *
        \***************************/


        this.Economics_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_economics'
        });

        this.Economics_Model = new mongoose.model("Category_economics", this.Economics_Schema);


        /***************************\
        *    SPORTS SCHEMA         *
        \***************************/


        this.Sports_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_sports'
        });

        this.Sports_Model = new mongoose.model("Category_sports", this.Sports_Schema);


        /***************************\
        *       ART SCHEMA         *
        \***************************/


        this.Art_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            urlToImage: {
                type: String
            },
            publishedAt: {
                type: String
            },
            content: {
                type: String
            },
        }, {
            collection: 'Category_arts'
        });

        this.Art_Model = new mongoose.model("Category_arts", this.Art_Schema);

        /***************************\
        *  NEW YORK TIMES ARTICLE  *
        \***************************/

        this.NYT_Schema = new mongoose.Schema({
            _id: {
                type: String
            },
            author: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            publishedAt: {
                type: String
            },
        }, {
            collection: 'NYT_breaking_news'
        });

        this.NYT_Model = new mongoose.model("NYT_breaking_news", this.NYT_Schema);
    }
}

module.exports = database;