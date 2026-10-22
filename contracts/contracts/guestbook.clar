;; StacksBoard public on-chain guestbook

(define-constant ERR-EMPTY-MESSAGE (err u100))
(define-constant ERR-MESSAGE-TOO-LONG (err u101))

(define-data-var message-count uint u0)

(define-map messages
  uint
  {
    author: principal,
    body: (string-utf8 140),
    created-at: uint
  })

;; Adds an immutable, publicly readable message to the board.
(define-public (post (body (string-utf8 140)))
  (begin
    (asserts! (> (len body) u0) ERR-EMPTY-MESSAGE)
    (asserts! (<= (len body) u140) ERR-MESSAGE-TOO-LONG)
    (let ((id (+ (var-get message-count) u1)))
      (map-set messages id {
        author: tx-sender,
        body: body,
        created-at: stacks-block-height
      })
      (var-set message-count id)
      (ok id))))

(define-read-only (get-message-count)
  (ok (var-get message-count)))

(define-read-only (get-message (id uint))
  (ok (map-get? messages id)))
