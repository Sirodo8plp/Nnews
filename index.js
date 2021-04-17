/*              TABLE OF CONTENTS
*
*Chapter 1: Require Modules
*Chapter 2: Listen Port
*Chapter 3: Home Route
*Chapter 4: Navigation Route
*Chapter 5: Request More Articles(h)
*Chapter 6: Request More Articles(c)
*Chapter 7: Error 404 - Page not Found
*Chapter 8: Misc Functions
*       $8.1: modify_breaking_news()
        $8.2: get_collection_model()
*
*Note: h stands for homepage and c for category.
*/

/****************************\
*       REQUIRE MODULES     * 
\****************************/
var express = require("express");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
const config = require(__dirname + "/mod__config");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.news_api_key);
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/News_Site_DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const database = require(__dirname + "/schemas.js");
const collections = new database(mongoose);
const axios = require("axios");
const nyt_link = "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=" + config.nyt_api_key;
const PORT = process.env.PORT || 3000;
/****************************\
*         LISTEN PORT       * 
\****************************/

app.listen(PORT, () => {
    console.log("Server started");
});

/****************************\
*         HOME ROUTE        * 
\****************************/

app.get("/", (request, response) => {
    newsapi.v2.topHeadlines({
        sources: "bbc-news",
    }).then(api => {
        api_articles = api.articles;
        collections.Article_Model.find({}, null, {
            sort: {
                publishedAt: -1
            }
        }, (error, server_articles) => {
            if (error) console.log(error);

            else if (server_articles === null || Object.keys(server_articles).length === 0) {
                collections.Article_Model.insertMany(api_articles, (error, res) => {
                    if (error) console.log(error);
                    else {
                        modify_breaking_news(nyt_list => {
                            return response.render("homepage", {
                                article_list: api_articles.slice(0, 5),
                                breaking_news: nyt_list
                            })
                        }, nyt_link);
                    }
                })
            } else {
                let different_articles = 0;
                for (let i = 0; i < api_articles.length; i++) {
                    if (api_articles[i].title !== server_articles[0].title)
                        different_articles += 1;
                    else break;
                }
                collections.Article_Model.insertMany(api_articles.slice(0, different_articles), (error, res) => {
                    modify_breaking_news(nyt_list => {
                        return response.render("homepage", {
                            article_list: api_articles.slice(0, 5),
                            breaking_news: nyt_list
                        })
                    }, nyt_link);

                });
            }

        });
    });
});

/****************************\
*      NAVIGATION ROUTE     * 
\****************************/

app.get("/category/:navCategory", (request, page_response) => {
    let category = request.params.navCategory;
    newsapi.v2.topHeadlines({
        category: category,
        language: "en"
    }).then(response => {
        api_articles = response.articles;
        let collection_model = get_collection_model(category);
        collection_model.find({}, null, {
            sort: {
                publishedAt: -1
            }
        }, (error, server_articles) => {
            if (error) return error;
            else if (server_articles === null || Object.keys(server_articles).length === 0 || !server_articles) {
                collection_model.insertMany(api_articles, (error, res) => {
                    if (error) return error;
                    else {
                        modify_breaking_news(nyt_list => {
                            return page_response.render("category", {
                                article_list: api_articles.slice(0, 5),
                                breaking_news: nyt_list,
                                cat: category
                            })
                        }, nyt_link);
                    }
                });
            } else {
                let different_articles = 0;
                for (let i = 0; i < api_articles.length; i++) {
                    if (api_articles[i].title !== server_articles[0].title)
                        different_articles += 1;
                    else break;
                }
                collection_model.insertMany(api_articles.slice(0, different_articles), (error, res) => {
                    if (error) return error;
                    else {
                        modify_breaking_news(nyt_list => {
                            return page_response.render("category", {
                                article_list: api_articles.slice(0, 5),
                                breaking_news: nyt_list,
                                cat: category
                            })
                        }, nyt_link);
                    }
                });
            }
        });

    }).catch(request_error => {
        if (request_error) return request_error;
    })

});

/****************************\
*  REQUEST MORE ARTICLES(C) * 
\****************************/

app.get("/show/more/:begin/:end/:category", (request, page_response) => {
    let begin = request.params.begin;
    let end = request.params.end;
    let category = request.params.category;
    let collection_model = get_collection_model(category);

    collection_model.find({}, null, {
        sort: {
            publishedAt: -1
        }
    }, (error, NewsAPI_articles) => {
        if (error) page_response.json("An error has occured with the database.Please,try again later!");
        else 
            // collections.NYT_Model.find({}, null, {
            //     sort: {
            //         publishedAt: -1
            //     }
            // }, (err, NYT_articles) => {
            //     let response_array = NewsAPI_articles.slice(begin, end);
            //     response_array.concat(NYT_articles.slice(begin, end));
            //     page_response.json(response_array);
            // });TODO TODO TODO TODO TODO TODO TODO TODO TODO
            page_response.json(NewsAPI_articles.slice(begin,end));
        // else page_response.json(server_articles.slice(begin, end));
    });
});

/****************************\
*  REQUEST MORE ARTICLES(H) * 
\****************************/

app.get("/show/more/:begin/:end", (request, page_response) => {
    let begin = request.params.begin;
    let end = request.params.end;

    collections.Article_Model.find({}, null, {
        sort: {
            publishedAt: -1
        }
    }, (error, server_articles) => {
        if (error) page_response.json("An error has occured with the database.Please,try again later!");
        else page_response.json(server_articles.slice(begin, end));
    });
});

/****************************\
*      SEARCH ARTICLES      * 
\****************************/

app.post("/search", (request, page_response) => {
    let topic = request.body.topic;
    newsapi.v2.everything({
        q: topic,
        sources: 'bbc-news,the-verge',
        domains: 'bbc.co.uk, www.theverge.com,www.wsj.com',
    }).then(res => {
        let articles = res.articles;
        modify_breaking_news(nyt_res => {
            if (articles.length === 0)
                return page_response.render("emptySearch", {
                    breaking_news: nyt_res
                });
            else
                page_response.render("search", {
                    results: articles,
                    breaking_news: nyt_res
                });
        }, nyt_link, 4000); //4000 for slice.
    });
});

/****************************\
* ERROR 404 - PAGE NOT FOUND * 
\****************************/

app.use(function (req, res) {
    res.status(404).render('error404');
});


/****************************\
*       MISC FUNCTIONS      * 
\****************************/


function modify_breaking_news(callback) {
    axios.get(arguments[1])
        .then(response => {
            nyt_articles = response.data.results;

            collections.NYT_Model.find({}, null, {
                sort: {
                    publishedAt: -1
                }
            }, (error, server_articles) => {
                if (error) return error;
                else if (server_articles === null || Object.keys(server_articles).length === 0) {
                    let breaking_news_articles = [];

                    nyt_articles.forEach(article => {
                        breaking_news_articles.push({
                            author: article.byline,
                            title: article.title,
                            description: article.abstract,
                            url: article.url,
                            publishedAt: article.published_date
                        });
                    });

                    collections.NYT_Model.insertMany(breaking_news_articles, error => {
                        if (error) console.log(error);
                        else if (arguments[2]) callback(nyt_articles.slice(0, arguments[2]));
                        else callback(nyt_articles.slice(0, 5));
                    })
                } else {
                    let different_articles = 0;
                    for (let i = 0; i < nyt_articles.length; i++) {
                        if (nyt_articles[i].title !== server_articles[0].title)
                            different_articles += 1;
                        else break;
                    }
                    collections.NYT_Model.insertMany(nyt_articles.slice(0, different_articles), (error, res) => {
                        if (error) return error;
                        else if (arguments[2]) callback(nyt_articles.slice(0, arguments[2]));
                        else callback(nyt_articles.slice(0, 5));
                    });
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function get_collection_model(category) {
    let collection_model = collections.Politic_Model //default model
    switch (category) {
        case "technology":
            collection_model = collections.Technology_Model;
            break;
        case "lifestyle":
            collection_model = collections.Lifestyle_Model;
            break;
        case "economics":
            collection_model = collections.Economics_Model;
            break;
        case "sports":
            collection_model = collections.Sports_Model;
            break;
        case "art":
            collection_model = collections.Art_Model;
            break;
    }
    return collection_model;
}