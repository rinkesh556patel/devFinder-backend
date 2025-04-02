
const validateUserData = async (data) => {
    console.log("Validating user data");
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "skills", "photoUrl"];
    const updates = Object.keys(data);
    return updates.every(update => allowedUpdates.includes(update));
};