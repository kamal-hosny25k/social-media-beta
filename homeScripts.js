// const { Button } = require("bootstrap");

	
				let currentPage = 1
				let lastPage = 1

		// ========= Start INFINITE SCROLL =========//
		window.addEventListener("scroll", function(){


			const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
			
			if(endOfPage && currentPage < lastPage){
				
				currentPage = currentPage + 1
				getPosts(false , currentPage)
				
			}
		});
		// ========= End INFINITE SCROLL =========//

		function userClicked(userId){
			window.location = `profile.html?userId=${userId}`
		}
				getPosts()
		function getPosts(reload = true, page = 1){
	
			    toggleLoader(true)
		axios.get(`${baseUrl}/posts?limit=2&page=${page}`)
			.then((response) => {
				toggleLoader(false)
				const posts = response.data.data

				lastPage = response.data.meta.last_page
				if(reload){
					document.getElementById("posts").innerHTML = ""
				}
				
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

					<span onclick="userClicked(${author.id})" style="cursor: pointer;">
						<img src=${author.profile_image} alt="" style="width: 50px; height: 50px;" class="rounded-circle border border-2">
						<b>${author.username}</b>
					</span>

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

					document.getElementById("posts").innerHTML += content

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



		function postClicked(postId){
			// alert(postId)
			window.location = `postDetails.html?postId=${postId}`
		}




            function addBtnClicked(){

				
                document.getElementById("post-modal-submit-btn").innerHTML = "Create"
                document.getElementById("post-id-input").value = ""
				document.getElementById("post-modal-title").innerHTML = "Create A New Post"
				document.getElementById("post-title-input").value= ""
				document.getElementById("post-body-input").value= ""
				let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
				postModal.toggle()
            }


