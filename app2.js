let ts = 0;
let currentId = 0;
let commentsUI = document.querySelector(".comments");
let pseudo = document.querySelector("#comment-pseudo");
let comment = document.querySelector("#comment-message");
let send = document.querySelector(".modal-content button");
//array of all tweets objects
let tweetsArr = [];
//array of influencers
let influencersArr = [];
//array of tweets of influencers
let influencersTweets = [];

// Sending and fetching data from the server

class Store {
    static getTweets() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://touiteur.cefim-formation.org/list', true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let tweets = data.messages;
                // ts = data.messages[data.messages.length-1].ts;
                // console.log('ts :', ts);
                UI.displayTweets(tweets);
            } else {
                console.log(this.status);
            }
        })
        xhr.send();
    }
    static getLastTweets(ts) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://touiteur.cefim-formation.org/list?ts=${ts}`, true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let tweets = data.messages.reverse();
                UI.displayTweets(tweets);
                //ts = data.messages[data.messages.length-1].ts;
            } else {
                console.log(this.status);
            }
        })
        xhr.send();
    }
    static sendTweet(name,message) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://touiteur.cefim-formation.org/send', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                // let tweets = JSON.stringify(this.responseText)
                // alert(JSON.parse(this.responseText).error);
            } else {
                console.log(this.status);
            }
        })
        let data = "name=" + encodeURIComponent(name) + "&message=" + encodeURIComponent(message);
        xhr.send(data);
    }
    static getTopLike() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://touiteur.cefim-formation.org/likes/top', true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let likes = data.top;
                UI.displayTopLike(likes);
            } else {
                console.log(this.status);
            }
        });
        xhr.send();
    }

    static getInfluencers() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://touiteur.cefim-formation.org/influencers?count=3', true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let tweets = data.influencers;
                for (let property in tweets) {
                    let output = document.querySelector(".influencers");
                    let p = document.createElement("p");
                    p.textContent = `${property}`;
                    influencersArr.push(property)
                    output.appendChild(p);
                }
            } else {
                console.log(this.status);
            }
        })
        xhr.send();
    }
    static trending() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://touiteur.cefim-formation.org/trending', true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                var entries = Object.entries(data);
                UI.displayTrends(entries);

            } else {
                console.log(this.status);
            }
        })
        xhr.send();
    }

    static getComments(id, insert) {
        console.log(id);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://touiteur.cefim-formation.org/comments/list?message_id=${id}`, true);
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let comments = data.comments;
                UI.displayComments(comments,insert)
            } else {
                console.log(this.status);
            }
        })
        xhr.send();
    }

    static sendComment(id, com, name) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://touiteur.cefim-formation.org/comments/send', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                console.log("id : " + id);
            } else {
                console.log(this.status);
            }
        })
        let data = "message_id=" + encodeURIComponent(id) + "&name=" + encodeURIComponent(name) + "&comment=" + encodeURIComponent(com);
        xhr.send(data);
    }

    static sendLike(id) {
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://touiteur.cefim-formation.org/likes/send', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                // data = JSON.stringify(this.responseText)
                // let tweets = data.messages;
                // console.log(tweets);
            } else {
                console.log(this.status);
            }
        })
        let data = "message_id=" + id;
        xhr.send(data);
    }

    static removeLike(id) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'http://touiteur.cefim-formation.org/likes/remove', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.addEventListener("load", function () {
            if (this.status === 200) {
                // data = JSON.stringify(this.responseText)
                // let tweets = data.messages;
                // console.log(tweets);
                // console.log('bad');
            } else {
                console.log(this.status);
            }
        })
        let data = "message_id=" + id;
        xhr.send(data);
    }
}

// Class Tweet

class Tweet {
    constructor(name, message,id,likes,comments) {
        this.name = name;
        this.message = message;
        this.id = id;
        this.likes = likes;
        this.comments = comments
        
    }
}
//Class UI

class UI {
    static displayTweets(tweets) {
        const container = document.getElementById("container");
        // creating a div tweet with messages, names, likes and comments
        for (let i = 0; i < tweets.length; i++) {
            //istantiate the tweet class
            const tweet = new Tweet(tweets[i].name,tweets[i].message[i],tweets[i].id,tweets[i].likes,tweets[i].comments_count)

            // Add every tweet to the tweetsArr array
            tweetsArr.push(tweet);

            let div = document.createElement("article");
            div.setAttribute("id", tweets[i].id);
            div.setAttribute("name", tweets[i].name);
            div.className = "tweet";
            let tweetmessage = document.createElement("div");
            tweetmessage.className = "tweet-message";
            let tweetName = document.createElement("div");
            tweetName.className = "tweet-name";

            // add like button
            let likeButton = document.createElement("button");
            likeButton.className = "btn-like";
            let likeIcon = document.createElement("i");
            likeIcon.className = "like far fa-thumbs-up";
            likeIcon.textContent = `${tweets[i].likes}`
            likeButton.appendChild(likeIcon);

            //send and remove like from the database

            likeButton.addEventListener("click", function (e) {
                console.log('e.target :', e.target);
                if (e.target.className === "like far fa-thumbs-up") {
                    Store.sendLike(tweets[i].id);
                    likeIcon.textContent = parseInt(likeIcon.textContent) + 1;
                } else if (e.target.className === "like far fa-thumbs-up fas") {
                    Store.removeLike(tweets[i].id);
                    likeIcon.textContent = parseInt(likeIcon.textContent) - 1;
                }
            });
            likeButton.addEventListener('click', () => likeIcon.classList.toggle("fas"));


            // add comment button

            let commentButton = document.createElement("button");
            commentButton.className = "btn-comment";
            let commentIcon = document.createElement("i");
            commentIcon.className = "comment far fa-comment";
            commentIcon.textContent = `${tweets[i].comments_count}`
            commentButton.appendChild(commentIcon);
            commentButton.addEventListener("click", () => {
                currentId = tweets[i].id;
                UI.displayModal(tweets[i].id);
            });


            //create a tweet
            tweetmessage.textContent = `${tweets[i].message}`
            tweetName.textContent = `${tweets[i].name}`
            div.appendChild(tweetmessage);
            div.appendChild(tweetName);
            div.appendChild(likeButton);
            div.appendChild(commentButton);
            container.appendChild(div);
            ts = tweets[i].ts;
        }
    }

    static displayTopLike(likes) {
        const topLike = document.querySelector(".top-like");
        likes.forEach(like => {
            const div = document.createElement("div");
            div.className = "tweet-like";
            const h3 = document.createElement("h3");
            h3.textContent = `${like.message}`;
            const p = document.createElement("p");
            p.textContent = `Posté par ${like.name}`
            const num = document.createElement("p");
            num.textContent = `likes ${like.likes}`;
            div.appendChild(h3);
            div.appendChild(p);
            div.appendChild(num);
            topLike.appendChild(div);
        });
    }

    static displayModal(id) {
        let modal = document.querySelector(".my-modal");
        modal.style.display = "block";
        commentsUI.textContent = "";
        Store.getComments(id, commentsUI)
        let close = document.querySelector(".close");
        close.addEventListener("click", () => {
            modal.style.display = "none";
        });
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

    }

    static displayComments (comments,insert){
        commentsUI.textContent = ""
        comments.forEach((comment) => {
            let com = document.createElement("p");
            com.textContent = `${comment.comment}`
            insert.appendChild(com);
        })

    }

    static displayTrends(entries) {
        //get rid of all this words 
        const trashs = ['the', 'pour', 'avec', 'les', 'des', 'mes', 'vous', 'nous', 'them', 'more', 'then', 'than', 'alors',
         'donc', 'pas', 'une', 'you', 'ses', 'ces', 'ont', 'tout', 'dans', 'est', 'sum', 'did', 'with', 'and', 'any','liked','test']
         const trends = entries.filter(entry=>trashs.every(trash=>entry[0] !== trash))
         // sort the array of trendings
        let output = document.querySelector(".trends");
        trends.sort((a,b)=>{return b[1] - a[1]})
        for(let i = 0;i<5;i++){
            let p = document.createElement("p");
            p.textContent = trends[i][0];
            output.appendChild(p);
        }
    }

    static highlightInfluencers (tweets){
  
        tweets.forEach(el1=>influencersArr.forEach(el2=>{
            if(el1.getAttribute("name") === el2){
                influencersTweets.push(el1)
            }
        }))
        influencersTweets.forEach(twt=>{
            let crown = document.createElement("i");
            crown.className = "fas fa-crown";
            twt.appendChild(crown)
        })
    }
}


//Events

// post comments
send.addEventListener("click", () => {
    if (comment.value && pseudo.value) {
        Store.sendComment(currentId, comment.value, pseudo.value);
        comment.value = "";
        pseudo.value = "";
        Store.getComments(currentId, commentsUI)
    }
});

//Event: Add tweet
document.querySelector('#my-form').addEventListener('submit', (e) => {
    e.preventDefault();
    //Get form values
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    //Add to store
    Store.sendTweet(name,message);
    name = "";
    message = "";
})

//reload le dom
document.addEventListener("DOMContentLoaded", ()=> {
    Store.getTweets();
    setInterval(() => {
        Store.getLastTweets(ts);
    }, 3000)
});


//top like tweet & trendings
document.addEventListener("DOMContentLoaded", Store.getTopLike);
document.addEventListener("DOMContentLoaded", Store.trending);

//influencers
document.addEventListener("DOMContentLoaded", Store.getInfluencers);

//Highlight influencers' posts
let checkbox = document.querySelector(".switch input");
checkbox.addEventListener("change", ()=>{
    let tweets = document.querySelectorAll(".tweet")
    if(checkbox.checked){
        UI.highlightInfluencers(tweets)
    }else{
        influencersTweets.forEach(tweet=>{
            tweet.removeChild(tweet.childNodes[4]);
        })
        influencersTweets = []
    }
})
