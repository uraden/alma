const baseUrl = "https://67d26eeb90e0670699bd84e5.mockapi.io/api/v1";
const fileUploadUrl = "https://store1.gofile.io/contents";

export default {
    users: () => [baseUrl, "users"].join("/"),
    uploadFile: () => [fileUploadUrl, 'uploadfile'].join("/"),
    userModify: (id) => [baseUrl, "users", id].join("/"),
}