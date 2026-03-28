# import secrets
# import redis
# from datetime import timedelta, datetime
#
#
# def create_session(user_id: int, extra_data: dict | None = None, ttl_minutes: int = 60) -> str:
#     session_id = secrets.token_urlsafe(32)
#
#     session_data = {
#         "user_id": user_id,
#         "created_at": str(datetime.utcnow()),  
#         "last_activity": str(datetime.utcnow()),
#         **(extra_data or {})
#     }
#
#     # Сохраняем в Redis с автоматическим удалением через ttl
#     key = f"session:{session_id}"
#     redis_client.hset(key, mapping=session_data)
#     redis_client.expire(key, timedelta(minutes=ttl_minutes))
#
#     return session_id
