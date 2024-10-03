const slugify = (str) => {
    const accentMap = {
        a: /[àáạảãâầấậẩẫ]/g,
        A: /[ÀÁẠẢÃÂẦẤẬẨẫ]/g,
        e: /[èéẹẻẽêềếệểễ]/g,
        E: /[ÈÉẸẺẼÊỀẾỆỂỄ]/g,
        i: /[ìíịỉĩ]/g,
        I: /[ÌÍỊỈĨ]/g,
        o: /[òóọỏõôồốộổỗơờớợởỡ]/g,
        O: /[ÒÓỌỎÕÔỒỐỘỖƠỜỚỢỞỠ]/g,
        u: /[ùúụủũưừứựửữ]/g,
        U: /[ÙÚỤỦŨƯỪỨỰỬỮ]/g,
        y: /[ỳýỵỷỹ]/g,
        Y: /[ỳÝỴỶỸ]/g,
        d: /[đ]/g,
        D: /[Đ]/g,
    };

    // Loại bỏ dấu
    for (const [key, value] of Object.entries(accentMap)) {
        str = str.replace(value, key);
    }

    return str
        .normalize('NFD') // chuẩn hóa chuỗi để tách các dấu
        .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu
        .replace(/[^\w\s-]/g, '') // giữ lại các ký tự chữ, số, khoảng trắng và dấu gạch ngang
        .replace(/\s+/g, '-') // thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-') // loại bỏ các dấu gạch ngang dư thừa
        .replace(/^-+|-+$/g, ''); // loại bỏ dấu gạch ngang ở đầu và cuối chuỗi
}

// Hàm tạo slug cho album
const createAlbumSlug = (name, artistName) => {
    const slugifiedName = slugify(name);
    const slugifiedArtist = slugify(artistName);
    return `${slugifiedName}-${slugifiedArtist}`;
}


export { slugify, createAlbumSlug };
