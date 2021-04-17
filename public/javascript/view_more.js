document.querySelector("#showMore").addEventListener("click", () => {
    let button = document.querySelector("#showMore");
    let article_counter = document.querySelectorAll('.article-container__hotline').length;
    let Main_Container = document.querySelector('.article-container__hotline').parentNode;
    document.querySelector("#showMore").parentNode.removeChild(button);

    fetch(`/show/more/${article_counter}/${article_counter+5}`).
    then(response => response.json()).
    then(new_articles => {
        if (new_articles.length > 0) {
            new_articles.forEach(article => {
                let article_container__hotline = document.createElement("div");
                article_container__hotline.classList.add("article-container__hotline");

                let ach__image_container = document.createElement("div");
                ach__image_container.classList.add("article-container__hotline-image-container");

                let img = document.createElement("img");
                img.classList.add("article-container__hotline-image");
                img.setAttribute("alt", "Hotline Image");

                let ach__details = document.createElement("div");
                ach__details.classList.add("article-container__hotline-details");

                let ach__title = document.createElement("h1");
                ach__title.classList.add("article-container__hotline-title");

                let ach__summary = document.createElement("p");
                ach__summary.classList.add("article-container__hotline-summary");

                let ach__button = document.createElement("a");
                ach__button.classList.add("button");
                ach__button.classList.add("button--article");
                ach__button.innerText = "Read the article";

                if (article.urlToImage) img.setAttribute("src", article.urlToImage);
                else img.setAttribute("src", "img/not_found_img.jpg.png");

                ach__title.innerText = article.title;
                ach__summary.innerText = article.description;
                ach__button.setAttribute("href", article.url);

                /**********************\
                *    JOIN THE PARTS   *
                \**********************/

                ach__image_container.appendChild(img);

                ach__details.appendChild(ach__title);
                ach__details.appendChild(ach__summary);
                ach__details.appendChild(ach__button);

                article_container__hotline.appendChild(ach__image_container);
                article_container__hotline.appendChild(ach__details);

                /**********************\
                *   INSERT TO THE DOM *
                \**********************/

                Main_Container.appendChild(article_container__hotline);
            });
            if ((new_articles.length % 5) === 0) Main_Container.appendChild(button);
        }
    })
});