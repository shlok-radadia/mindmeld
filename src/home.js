function pfp_square() {
    const profile = document.getElementById('image_02');
    const height = profile.offsetHeight;
    profile.style.width = `${height}px`;
}
window.addEventListener('load', pfp_square);
window.addEventListener('resize', pfp_square);

document.getElementById("reaction_start").addEventListener('click', () => {
    window.open("../reaction/index.html", "_self")
})
document.getElementById("problem_start").addEventListener('click', () => {
    window.open("../problem/index.html", "_self")
})
document.getElementById("attention_start").addEventListener('click', () => {
    window.open("../attention/index.html", "_self")
})
document.getElementById("memory_start").addEventListener('click', () => {
    window.open("../memory/index.html", "_self")
})


document.getElementById("profile").addEventListener("click", () => {
    window.open("../profile/index.html", "_self")
})