const tryCatch = (func) => {
    return (req, res, next) => func(req, res, next).catch((err) => next(err));
};

module.exports = tryCatch;

// (func): เป็นพารามิเตอร์ที่รับฟังก์ชัน func ซึ่งจะเป็น middleware
// (req, res, next): ฟังก์ชันที่ส่งกลับจะเป็น middleware
// func(req, res, next): เรียกใช้ฟังก์ชัน func ที่ส่งเข้ามา
