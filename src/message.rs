pub fn make_text_message(author: String, text: String) -> String {
    serde_json::json!({
        "type": "TextMsg",
        "author": author,
        "text": text
    })
    .to_string()
}

pub fn make_join_notify_message(text: String) -> String {
    serde_json::json!({
        "type": "JoinNotify",
        "author": "Server",
        "text": text
    })
    .to_string()
}

pub fn make_user_list(users: &Vec<String>) -> String {
    serde_json::json!({
        "type": "UserList",
        "users": users
    })
    .to_string()
}
