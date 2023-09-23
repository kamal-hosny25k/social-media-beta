setupUI()
getUser()


function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userId");
    return id
}
function getUser(){
    const id = getCurrentUserId() ;

    axios.get(`${baseUrl}/users/${id}`)
    .then((response) => {
        const user = response.data.data
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("main-info-image").src = user.profile_image
        document.getElementById("name-posts").innerHTML = `${user.username}'s`

        // posts & comments count
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
    })
}

getPosts()

function getPosts(){
	const id =getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
        .then((response) => {
            const posts = response.data.data
            document.getElementById("user-posts").innerHTML= ""
            for (post of posts) {

                const author = post.author
                let postTitle = ""

                // show or hide (edit) button
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editBtnContent = ``

                if(isMyPost){
                    editBtnContent =`
                    <button class="btn btn-danger" style=" margin-left: 5px; float:right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                    <button class="btn btn-secondary" style="float:right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                    `
                }

                if (post.title != null) {
                    postTitle = post.title
                }

                let content = `
            <div class="card shadow">
                <div class="card-header">
                    <img src=${author.profile_image} alt="" style="width: 50px; height: 50px;" class="rounded-circle border border-2">
                    <b>${author.username}</b>

                    ${editBtnContent}

                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                    <img src=${post.image} alt="" class="w-100">

                    <h6 style="color: rgb(193, 193, 193);" class="mt-1">
                        ${post.created_at}
                    </h6>

                    <h5>
                        ${postTitle}
                    </h5>

                    <p>
                        ${post.body}
                    </p>

                    <hr>
                    <div>
                        <i class="bi bi-pen"></i>
                        <span>
                            (${post.comments_count}) Comments

                            <span id="post-tags-${post.id}">
                                <button class="btn btn-sm rounded-5" style="background-color: gray; color: #fff;">
                                    Policy
                                </button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            `

                document.getElementById("user-posts").innerHTML += content

                const currentPostTagsId = `post-tags-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ""

                for(tag of post.tags){
                    console.log(tag.name)
                    let tagContent =`
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: #fff;">
                                    ${tag.name}
                                </button>
                    `
                    document.getElementById(currentPostTagsId).innerHTML += tagContent
                }
            }
        })

    }
