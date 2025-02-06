const scriptURL = 'https://script.google.com/macros/s/AKfycbyzswai2VGxjUpZSQsz9Q-g2vxCKSfrQJhzcFb72Q4wnk4HtgJXZAtqwbzQ8mJpXz7cqA/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => alert("Thank you! your form is submitted successfully." ))
    .then(() => { window.location.reload(); })
    .catch(error => console.error('Error!', error.message))
})