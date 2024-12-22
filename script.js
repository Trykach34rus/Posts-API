const postContainer = document.querySelector('.posts')
const postTemplate = document.querySelector('.post-template')
const tagContainer = document.querySelector('.tags')
const tagTemplate = document.querySelector('.tag-template')
const search = document.querySelector('.search-input')
const sortAbcButton = document.querySelector('.sort-abc')
const sortLikesButton = document.querySelector('.sort-likes')
const sortViewsButton = document.querySelector('.sort-views')
const filterLikesButton = document.querySelector('.filter-likes')
const filterViewsButton = document.querySelector('.filter-views')
const filterDislikesButton = document.querySelector('.filter-dislikes')

let allPosts = []

function fetchPost() {
	fetch('https://dummyjson.com/posts')
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				console.log('Ошибка сети')
			}
		})
		.then(data => {
			allPosts = data.posts
			displayPosts(allPosts)
		})
		.catch(error => console.log(error))
}
function fetchTags() {
	fetch('https://dummyjson.com/posts/tags')
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				console.log('Ошибка сети')
			}
		})
		.then(data => {
			if (Array.isArray(data)) {
				const limitedTags = data.slice(0, 10)
				displayTags(limitedTags)
			} else {
				console.error('Теги не найдены или не являются массивом')
			}
		})
		.catch(error => console.log(error))
}
function displayPosts(posts) {
	postContainer.innerHTML = null
	posts.forEach(post => {
		const clone = postTemplate.content.cloneNode(true)
		const postTitle = clone.querySelector('.post-title')
		const postText = clone.querySelector('.post-text')
		const likes = clone.querySelector('.likes')
		const dislikes = clone.querySelector('.dislikes')
		const views = clone.querySelector('.views')
		postTitle.textContent = post.title
		postText.textContent = post.body
		likes.textContent = `Лайки: ${post.reactions.likes}`
		dislikes.textContent = `Дизлайки: ${post.reactions.dislikes}`
		views.textContent = `Просмотры:${post.views}`
		postContainer.append(clone)
	})
}
function displayTags(tags) {
	tagContainer.innerHTML = null
	tags.forEach(tag => {
		const clone = tagTemplate.content.cloneNode(true)
		const tagElement = clone.querySelector('.tag')
		tagElement.innerHTML = tag.name
		tagElement.onclick = () => {
			const activeTag = document.querySelector('.tag-active')
			if (activeTag) {
				activeTag.classList.remove('tag-active')
			}
			tagElement.classList.add('tag-active')
			filterPostsByTag(tag.slug)
		}
		tagContainer.append(clone)
	})
}
function filterPostsByTag(tag) {
	const filterPost = allPosts.filter(
		post => post.tags && post.tags.includes(tag)
	)
	displayPosts(filterPost)
}

function searchPosts() {
	const value = search.value
	const filterPosts = allPosts.filter(
		post =>
			post.title.toLowerCase().includes(value.toLowerCase()) ||
			post.body.toLowerCase().includes(value.toLowerCase())
	)
	displayPosts(filterPosts)
}
function sortBySwitch(item) {
	let sortPost
	switch (item) {
		case 'abc':
			sortPost = allPosts
				.concat()
				.sort((a, b) => a.title.localeCompare(b.title))
			break
		case 'sortPostLikes':
			sortPost = allPosts
				.concat()
				.sort((a, b) => b.reactions.likes - a.reactions.likes)
			break
		case 'sortPostViews':
			sortPost = allPosts.concat().sort((a, b) => b.views - a.views)
			break
		default:
			console.log('Неизвестный кретерий')
			return
	}
	displayPosts(sortPost)
}
function filterBySwitch(item) {
	let filterPost
	switch (item) {
		case 'likesMoreDislikes':
			filterPost = allPosts.filter(
				post => post.reactions.likes > post.reactions.dislikes
			)
			break
		case 'viewsMoreThousand':
			filterPost = allPosts.filter(item => item.views > 1000)
			break
		case 'dislikesMoreLikes':
			filterPost = allPosts.filter(
				post => post.reactions.dislikes > post.reactions.likes
			)
			break
		default:
			console.log('Неизвестный критерий')
			return
	}
	displayPosts(filterPost)
}
filterBySwitch('likesMoreDislikes')
filterBySwitch('viewsMoreThousand')
filterBySwitch('dislikesMoreLikes')
sortBySwitch('abc')
sortBySwitch('sortPostLikes')
sortBySwitch('sortPostViews')

fetchPost()
fetchTags()
search.oninput = searchPosts
sortAbcButton.onclick = () => sortBySwitch('abc')
sortLikesButton.onclick = () => sortBySwitch('sortPostLikes')
sortViewsButton.onclick = () => sortBySwitch('sortPostViews')
filterLikesButton.onclick = () => filterBySwitch('likesMoreDislikes')
filterViewsButton.onclick = () => filterBySwitch('viewsMoreThousand')
filterDislikesButton.onclick = () => filterBySwitch('dislikesMoreLikes')
