const jsonwebtoken = require('jsonwebtoken');
const knex = require("../database/knex");
function validateUser(req, res, next) {
    const { name, age } = req.body;
    console.log(req.body);
    const regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/; // biểu thức chính quy kiểm tra tên
    if (!name || !age) {  res.status(400).json({ message: 'Tên hoặc tuổi không được để trống' }); }
    else if (!regex.test(name)) {
        res.status(400).json({ message: 'Tên không được chứa số hoặc kí tự đặc biệt' });
        
    }
    else if(age <= 0) {
        res.status(400).json({ message: 'Tuổi phải lớn hơn 0' });
    }
    else {
        next();
    }
}
//hàm kiểm tra role
async function kiemTraQuyenTruyCap(role, permission) {
    console.log("ahfbdb"+role);
    // Lấy danh sách quyền cho vai trò từ cơ sở dữ liệu hoặc thông tin đăng nhập
    const rows = await knex('role_permissions')
        .select('permissions.name')
        .join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
        .where('role_permissions.role_id', role);
    // Lấy danh sách quyền từ kết quả truy vấn
    const Roles = rows.map(row => row.name);
    if (Roles.includes(permission)) {
        return true; // Có quyền truy cập
    } else {
        return false; // Không có quyền truy cập
    }
}

function checkAccess(permission) {
    return async (req, res, next) => {
        const author = req.headers.authorization.substring(7);
        const role = jsonwebtoken.verify(author, process.env.secretKey).role;
        // Kiểm tra quyền truy cập
        if (await kiemTraQuyenTruyCap(role, permission)) {
            next(); // Cho phép truy cập tiếp theo
        } else {
            res.status(403).json({ message: 'Access denied' });
            console.log("access denied"); // Truy cập bị từ chối
        }
    };
}

module.exports={validateUser,checkAccess} ;