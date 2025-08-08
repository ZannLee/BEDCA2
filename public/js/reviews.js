document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createReviewForm');
  const reviewAmtInput = document.getElementById('review_amt');
  const reviewsList = document.getElementById('reviewsList');

  const authUserId = parseInt(localStorage.getItem('userId'), 10); // Logged-in user's ID
  const token = localStorage.getItem('token'); // JWT token

  if (!form || !reviewAmtInput || !reviewsList) {
    console.error("Required DOM elements not found");
    return;
  }

  if (!token || !authUserId) {
    console.error("User not authenticated (missing token or userId).");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createReview();
  });

  function generateStars(amount) {
    const filled = '★'.repeat(amount);
    const empty = '☆'.repeat(5 - amount);
    return filled + empty;
  }

  function generateStarsClickable(amount, reviewId, userId) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= amount ? '★' : '☆';
      starsHTML += `<span 
                      class="star-rating-clickable" 
                      data-star="${i}" 
                      data-id="${reviewId}" 
                      data-user="${userId}" 
                      style="cursor:pointer; font-size:1.2em; color: gold;">
                      ${filled}
                    </span>`;
    }
    return starsHTML;
  }

  fetchReviews();

  async function fetchReviews() {
    try {
      const response = await fetch('http://localhost:3000/api/reviews');
      const reviews = await response.json();

      if (!Array.isArray(reviews)) {
        throw new Error("Invalid response: not an array");
      }

      reviewsList.innerHTML = '';
      reviews.forEach((review) => {
        const isOwner = (review.user_id === authUserId) || (authUserId === 1);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${review.id}</td>
          <td>${review.user_id}</td>
          <td>
            ${isOwner 
              ? generateStarsClickable(review.review_amt, review.id, review.user_id) 
              : generateStars(review.review_amt)
            }
          </td>
          <td>
            ${isOwner ? `
              <button class="btn btn-sm btn-outline-danger" onclick="deleteReview(${review.id}, ${review.user_id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            ` : ''}
          </td>
        `;
        reviewsList.appendChild(row);
      });
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      reviewsList.innerHTML = `<tr><td colspan="4">Error loading reviews</td></tr>`;
    }
  }

  async function createReview() {
    const review_amt = reviewAmtInput.value.trim();

    if (!review_amt) {
      alert("Review amount is required.");
      return;
    }

    const data = {
      user_id: authUserId,
      review_amt: parseInt(review_amt),
    };

    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Review created successfully!");
      reviewAmtInput.value = '';
      fetchReviews();
    } catch (err) {
      console.error("Failed to create review:", err);
      alert("Failed to create review:\n" + err.message);
    }
  }

  reviewsList.addEventListener('click', async (e) => {
    const star = e.target.closest('.star-rating-clickable');
    if (!star) return;

    const reviewId = star.dataset.id;
    const reviewUserId = parseInt(star.dataset.user);
    const starValue = parseInt(star.dataset.star);

    if (authUserId !== 1 && reviewUserId !== authUserId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ review_amt: starValue, user_id: reviewUserId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert(`Review updated to ${starValue} star${starValue > 1 ? 's' : ''}!`);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review amount:", err);
      alert("Update failed:\n" + err.message);
    }
  });

  window.deleteReview = async (id, reviewUserId) => {
    if (authUserId !== 1 && reviewUserId !== authUserId) {
      alert("You can only delete your own reviews.");
      return;
    }

    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Review deleted successfully.");
      fetchReviews();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete:\n" + err.message);
    }
  };
});
