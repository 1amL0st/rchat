pub mod server_msgs;
pub mod data_msgs;

pub fn make_text_msg(author: String, text: String) -> String {
    serde_json::json!({
        "type": "TextMsg",
        "author": author,
        "text": text
    })
    .to_string()
}

pub fn make_login_change_notify_msg(old_login: &String, new_login: &String) -> String {
    serde_json::json!({
        "type": "DataChanged",
        "subType": "LoginChangeNotify",
        "author": "Server",
        "text": format!("User {} has changed its name to {}!", old_login, new_login)
    })
    .to_string()
}

pub fn make_room_list_update_notify() -> String {
    serde_json::json!({
        "type": "DataChanged",
        "subType": "RoomListUpdate",
    })
    .to_string()
}

