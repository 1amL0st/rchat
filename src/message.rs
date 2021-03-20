pub fn user_text_message(author: String, text: String) -> String {
    serde_json::json!({
        "author": author,
        "text": text
    })
    .to_string()
}
