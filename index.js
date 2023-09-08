import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// adding a new function to save tweet data to local storage
// the function is called whenever there are changes to 
// the current tweets data in these functions: 
// handleTweetBtnClick, handleLikeClick, handleRetweetClick, 
// and handleReplyBtnClick
let copiedTweetsData = JSON.parse(JSON.stringify(tweetsData))
// console.log(copiedTweetsData)

function saveTweetsToLocalStorage() {
    localStorage.setItem('localStorageTweetsData', JSON.stringify(copiedTweetsData))
  }

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
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = copiedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
    saveTweetsToLocalStorage()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = copiedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
    saveTweetsToLocalStorage()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = copiedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    if(replyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@QuipQuack`,
            profilePic: `images/duck.png`,
            tweetText: replyInput.value
        })
        render()
        saveTweetsToLocalStorage()
        replyInput.value = ''
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        copiedTweetsData.unshift({
            handle: `@QuipQuack`,
            profilePic: `images/duck.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    saveTweetsToLocalStorage()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    copiedTweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
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
			<img src="images/duck.png" class="profile-pic">
			<textarea placeholder="Tweet your reply" id="reply-input-${tweet.uuid}"></textarea>
		    <button id="reply-btn" data-tweetreply="${tweet.uuid}">Reply</button>
        </div>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render() {
    let tweetsDataFromLocalStorage = localStorage.getItem('localStorageTweetsData');
    if (tweetsDataFromLocalStorage !== null) {
      try {
        copiedTweetsData = JSON.parse(tweetsDataFromLocalStorage);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
    document.getElementById('feed').innerHTML = getFeedHtml();
  }

render()

