// This code empowers all input tags having a placeholder and data-slots attribute
document.addEventListener('DOMContentLoaded', () => {
    for (const el of document.querySelectorAll("[placeholder][data-slots]")) {
        const pattern = el.getAttribute("placeholder")
        const slots = new Set(el.dataset.slots || "_")
        const prev = (j => Array.from(pattern, (c, i) => slots.has(c) ? j = i + 1 : j))(0)
        const first = [...pattern].findIndex(c => slots.has(c))
        const accept = new RegExp(el.dataset.accept || "\\d", "g")

        function clean(input) {
            input = input.match(accept) || [];
            return Array.from(pattern, c =>
                input[0] === c || slots.has(c) ? input.shift() || c : c
            );
        }

        function format() {
            const [i, j] = [el.selectionStart, el.selectionEnd].map(i => {
                i = clean(el.value.slice(0, i)).findIndex(c => slots.has(c));
                return i < 0 ? prev.at(-1) : back ? prev[i - 1] || first : i;
            });
            el.value = clean(el.value).join("");
            el.setSelectionRange(i, j);
            back = false;
        };
        
        let back = false;
        el.addEventListener("keydown", (e) => back = e.key === "Backspace");
        el.addEventListener("input", format);
        el.addEventListener("focus", format);
        el.addEventListener("blur", () => el.value === pattern && (el.value = ""));
    }
});