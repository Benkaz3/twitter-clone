import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const updatedTweets = localStorage.getItem('updatedTweets')

/* Steps to render tweets */

// 1. Build the feed html
function getFeedHtml(tweets){
    let feedHtml = ``
    
    // Conditionally set color to like, retweet icons by
    // adding or removing css classes 
    tweets.forEach(function(tweet){
        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        // Get tweet replies html
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
         
        // Get tweets feed html
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
                <div class="reply-input-area">
                    <img src="images/scrimbalogo.png" class="profile-pic">
                    <textarea placeholder="Tweet your reply" id="reply-input${tweet.uuid}"></textarea>
                    <button id="reply-btn" data-tweetreply="${tweet.uuid}">Reply</button>
                </div>
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function renderTweets(tweets){
     document.getElementById('feed').innerHTML = getFeedHtml(tweets)
}

// 2. Render inital tweets
renderTweets(tweetsData)

function handleLikeClick(tweetId){ 
    const tweet = tweetsData.find(function(tweet){
        return tweet.uuid === tweetId
    })

    if (tweet.isLiked){
        tweet.likes--
    }
    else{
        tweet.likes++ 
    }
    tweet.isLiked = !tweet.isLiked
    // Save tweets 
    saveTweets(tweetsData)
}

function handleRetweetClick(tweetId){
    const tweet = tweetsData.find(function(tweet){
        return tweet.uuid === tweetId
    })
    
    if(tweet.isRetweeted){
        tweet.retweets--
    }
    else{
        tweet.retweets++
    }
    tweet.isRetweeted = !tweet.isRetweeted
    // Save tweets 
    saveTweets(tweetsData)
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyBtnClick(tweetId){
    const tweet = tweetsData.find(function(tweet){
        return tweet.uuid === tweetId
    })

    const replyInput = document.getElementById(`reply-input${tweetId}`)
    if(replyInput.value){
        tweet.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value
        })
        // Save tweets 
        saveTweets(tweetsData)
        replyInput.value = ''
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        const newTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
    tweetsData.unshift(newTweet)
    // Save tweets 
    saveTweets(tweetsData)
    tweetInput.value = ''
    }
}

function saveTweets(tweets) {
    localStorage.setItem('updatedTweets', JSON.stringify(tweets))
    // Render updated tweets 
    renderTweets(tweets)
    }

function loadTweets() {
    if (updatedTweets) {
        const tweets = JSON.parse(updatedTweets)
        renderTweets(tweets)
        /* Add event listeners reloaded tweets */
        document.addEventListener('click', function(e){
            if(e.target.dataset.like){
               handleLikeClick(e.target.dataset.like) 
            }
            else if(e.target.dataset.retweet){
                handleRetweetClick(e.target.dataset.retweet)
            }
            else if(e.target.dataset.reply){
                handleReplyClick(e.target.dataset.reply)
            }
            else if(e.target.id === 'tweet-btn'){
                handleTweetBtnClick()
            }
            else if(e.target.dataset.tweetreply){
                handleReplyBtnClick(e.target.dataset.tweetreply)
            }
        })
    }
    }
    
loadTweets()

