// ----------------- Task Section -------------------

let tasks = [
  { text: "Task 1", done: false },
  { text: "Task 2", done: false },
  { text: "Task 3", done: false },
  // Add more tasks here...
];

const taskList = document.getElementById('task-list');

// Function to render tasks
function renderTasks() {
  taskList.innerHTML = '';
  let pendingTasks = tasks.filter(task => !task.done);
  let doneTasks = tasks.filter(task => task.done);
  let limitedTasks = [...pendingTasks, ...doneTasks].slice(0, 5); // Limit to 5 tasks

  limitedTasks.forEach(task => {
      let taskItem = document.createElement('li');
      taskItem.classList.add(task.done ? 'done-task' : 'pending-task');
      taskItem.innerHTML = `
          <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(this, '${task.text}')"> <span ${task.done ? 'style="text-decoration: line-through;"' : ''}>${task.text}</span>
          <button class="ml-2 text-red-500 hover:text-red-600" onclick="deleteTask('${task.text}')">x</button>
      `;
      taskList.appendChild(taskItem);
  });

  updateTaskCount();
}

// Function to add a new task
document.getElementById('save-task-btn').addEventListener('click', function() {
  const newTask = document.getElementById('new-task-input').value;
  if (newTask) {
      tasks.push({ text: newTask, done: false });
      renderTasks();
      document.getElementById('new-task-input').value = '';
  }
});

// Function to toggle task status
function toggleTask(checkbox, taskText) {
  tasks = tasks.map(task => {
      if (task.text === taskText) task.done = checkbox.checked;
      return task;
  });
  renderTasks();
}

// Function to delete task
function deleteTask(taskText) {
  tasks = tasks.filter(task => task.text !== taskText);
  renderTasks();
}

// Function to update done/pending counts
function updateTaskCount() {
  let doneCount = tasks.filter(task => task.done).length;
  let pendingCount = tasks.length - doneCount;

  document.querySelector('.bg-green-200').textContent = `${doneCount} Done`;
  document.querySelector('.bg-red-200').textContent = `${pendingCount} Pending`;
}

// Function to show more tasks
function showMoreTasks() {
  let allTasks = tasks;
  taskList.innerHTML = ''; // Clear the list

  allTasks.forEach(task => {
      let taskItem = document.createElement('li');
      taskItem.classList.add(task.done ? 'done-task' : 'pending-task');
      taskItem.innerHTML = `
          <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(this, '${task.text}')"> ${task.text}
          <button class="ml-2 text-red-500 hover:text-red-600" onclick="deleteTask('${task.text}')">x</button>
      `;
      taskList.appendChild(taskItem);
  });
}

// Initial render
renderTasks();

// ----------------- Newsfeed Section -------------------

let posts = [
  { name: 'User1', content: 'This is a demo post.', favorites: 3, comments: 0, date: '4th Dec 2023', lastEdited: '5th Dec 2023', isUserPost: false },
  { name: 'User2', content: 'Another post in the newsfeed.', favorites: 2, comments: 1, date: '3rd Dec 2023', lastEdited: '4th Dec 2023', isUserPost: false },
];

let postLimit = 2; // Initially, only 2 posts will be shown

// Renders the posts on the newsfeed
function renderPosts() {
  let postContainer = document.getElementById('newsfeed-posts');
  postContainer.innerHTML = '';

  posts.slice(0, postLimit).forEach((post, index) => {
      let postElement = document.createElement('div');
      postElement.classList.add('border', 'p-4', 'rounded-lg', 'shadow-md');
      
      // Truncate content to 40 characters
      let truncatedContent = post.content.length > 40 ? post.content.substring(0, 40) + '...' : post.content;
      let expandBtn = post.content.length > 40 ? '<span class="expand-btn text-blue-500 hover:underline cursor-pointer">Expand Story</span>' : '';

      postElement.innerHTML = `
        <div class="flex justify-between">
          <span class="font-bold">${post.name}</span>
          ${post.isUserPost ? `
            <div class="flex space-x-2">
              <button class="edit-btn text-blue-500 hover:underline">Edit</button>
              <button class="delete-btn text-red-500 hover:underline">Delete</button>
            </div>` : ''}
        </div>
        <p class="text-sm text-gray-500">Activity happened on ${post.date}, Last edited at ${post.lastEdited}</p>
        <p>${truncatedContent} ${expandBtn}</p>
        <div class="flex justify-between items-center mt-2">
          <div class="flex items-center">
            <button class="heart-btn text-red-500">❤</button>
            <span class="ml-1">${post.favorites} Favorites</span>
          </div>
          <span>${post.comments} Comments</span>
        </div>
        <input type="text" placeholder="Write a comment..." class="border rounded-lg w-full p-2 mt-2"/>
      `;
      postContainer.appendChild(postElement);

      // Handle Expand Story
      let expandButton = postElement.querySelector('.expand-btn');
      if (expandButton) {
          expandButton.addEventListener('click', () => {
              expandButton.previousSibling.textContent = post.content; // Replace with full content
              expandButton.remove(); // Remove the button
          });
      }

      // Handle Edit
      if (post.isUserPost) {
          let editButton = postElement.querySelector('.edit-btn');
          let deleteButton = postElement.querySelector('.delete-btn');
          
          editButton.addEventListener('click', () => {
              let newContent = prompt('Edit your post:', post.content);
              if (newContent) {
                  post.content = newContent;
                  post.lastEdited = 'Now';
                  renderPosts(); // Re-render posts
              }
          });

          deleteButton.addEventListener('click', () => {
              posts.splice(index, 1);
              renderPosts();
          });
      }
  });
}

// Adding a new post
document.getElementById('post-btn').addEventListener('click', () => {
  let newPostContent = document.getElementById('new-post').value.trim();
  if (newPostContent.length < 3) {
      document.getElementById('post-warning').classList.remove('hidden');
  } else {
      posts.unshift({ name: 'Current User', content: newPostContent, favorites: 0, comments: 0, date: 'Now', lastEdited: 'Now', isUserPost: true });
      renderPosts();
      document.getElementById('new-post').value = '';
      document.getElementById('post-warning').classList.add('hidden');
  }
});

// Load more posts
document.getElementById('load-more-btn').addEventListener('click', () => {
  postLimit = posts.length; // Set limit to total posts
  renderPosts();
});

// Initialize the posts on page load
renderPosts();

// ----------------- Board Section -------------------

// Initialize boards array
// Initial demo board
let boards = [
  { title: "Demo Board", bullets: ["x", "y", "z", "w", "v"] }
];

// Function to render boards
function renderBoards() {
  const boardsContainer = document.getElementById('boards-container');
  boardsContainer.innerHTML = ''; // Clear previous boards

  boards.forEach((board, index) => {
      let boardElement = document.createElement('div');
      boardElement.classList.add('bg-white', 'shadow-lg', 'p-4', 'rounded-lg', 'mb-4');

      // Add board title
      boardElement.innerHTML = `<h3 class="text-lg font-bold text-gray-600 mb-2">${board.title}</h3>`;

      // Add bulleted points
      let bulletList = document.createElement('ul');
      bulletList.classList.add('list-disc', 'pl-6');
      board.bullets.forEach(bullet => {
          let bulletItem = document.createElement('li');
          bulletItem.textContent = bullet;
          bulletList.appendChild(bulletItem);
      });

      boardElement.appendChild(bulletList);
      boardsContainer.appendChild(boardElement);
  });
}

// Function to show board creation form
function showBoardForm() {
  const boardForm = document.getElementById('new-board-form');
  boardForm.classList.remove('hidden'); // Show the form when 'Create New Board' is clicked
}

// Function to handle board creation
document.getElementById('create-board-btn').addEventListener('click', function() {
  const newBoardTitle = document.getElementById('board-title-input').value;
  const newBoardBullets = document.getElementById('board-bullets-input').value.split('\n').filter(bullet => bullet.trim() !== '');

  if (newBoardTitle && newBoardBullets.length) {
      boards.push({ title: newBoardTitle, bullets: newBoardBullets });
      renderBoards();

      // Reset the form
      document.getElementById('board-title-input').value = '';
      document.getElementById('board-bullets-input').value = '';
      document.getElementById('new-board-form').classList.add('hidden'); // Hide the form after creating a board
  }
});

// Initial render
renderBoards();



// Selectors for contact functionality
const searchContactBtn = document.getElementById("search-contact-btn");
const contactSearchInput = document.getElementById("contact-search");
const contactList = document.getElementById("contact-list");
const newContactInput = document.getElementById("new-contact-input");
const addContactBtn = document.getElementById("add-contact-btn");

// Function to filter contacts based on search input
searchContactBtn.addEventListener("click", function() {
    const searchTerm = contactSearchInput.value.toLowerCase();
    const contacts = contactList.querySelectorAll(".contact-item");

    // Show all contacts initially
    contacts.forEach(contact => {
        contact.style.display = "block"; // Reset display
        // Hide contacts that don't match the search term
        if (!contact.dataset.name.toLowerCase().includes(searchTerm)) {
            contact.style.display = "none";
        }
    });
});

// Function to add a new contact
addContactBtn.addEventListener("click", function() {
    const newContact = newContactInput.value.trim();

    if (newContact) {
        const newContactItem = document.createElement("li");
        newContactItem.className = "contact-item";
        newContactItem.dataset.name = newContact;
        newContactItem.textContent = newContact;

        contactList.appendChild(newContactItem);
        newContactInput.value = ""; // Clear input after adding
    } else {
        alert("Please enter a contact name.");
    }
});
