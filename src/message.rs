pub fn make_text_msg(author: String, text: String) -> String {
    serde_json::json!({
        "type": "TextMsg",
        "author": author,
        "text": text
    })
    .to_string()
}

pub fn make_leave_notify_msg(text: String) -> String {
    serde_json::json!({
        "type": "LeaveNotify",
        "author": "Server",
        "text": text
    })
    .to_string()
}

pub fn make_join_notify_msg(text: String) -> String {
    serde_json::json!({
        "type": "JoinNotify",
        "author": "Server",
        "text": text
    })
    .to_string()
}

pub fn make_user_list_msg(users: &Vec<String>) -> String {
    serde_json::json!({
        "type": "UserList",
        "users": users
    })
    .to_string()
}

pub fn make_rooms_list_msg(rooms: &Vec<String>) -> String {
    serde_json::json!({
        "type": "RoomList",
        "rooms": rooms
    })
    .to_string()
}

pub fn make_current_room_msg(room: String) -> String {
    serde_json::json!({
        "type": "CurRoom",
        "name": room
    })
    .to_string()
}
