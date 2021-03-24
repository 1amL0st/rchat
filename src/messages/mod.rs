pub mod server_msgs;

pub fn make_text_msg(author: String, text: String) -> String {
    serde_json::json!({
        "type": "TextMsg",
        "author": author,
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

pub fn make_login_change_notify_msg(old_login: &String, new_login: &String) -> String {
    serde_json::json!({
        "type": "LoginChangeNotify",
        "author": "Server",
        "text": format!("User {} has changed its name to {}!", old_login, new_login)
    })
    .to_string()
}

pub fn make_room_list_update_notify() -> String {
    serde_json::json!({
        "type": "RoomListUpdate",
    })
    .to_string()
}

