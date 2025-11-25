# minimax_ai.py: Chứa thuật toán Minimax để quyết định nước đi tối ưu cho AI ('O')

# Hàm kiểm tra xem người chơi/AI có thắng không
def check_win(board, player):
    # Các điều kiện thắng (3 hàng ngang, 3 cột dọc, 2 đường chéo)
    win_conditions = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),
        (0, 3, 6), (1, 4, 7), (2, 5, 8),
        (0, 4, 8), (2, 4, 6)
    ]
    for condition in win_conditions:
        if all(board[i] == player for i in condition):
            return True
    return False

# Hàm kiểm tra hòa cờ (khi bàn cờ đầy mà không ai thắng)
def check_tie(board):
    return ' ' not in board

# Thuật toán Minimax
# is_maximizing: True nếu đang tính cho AI (muốn tối đa điểm số), False nếu đang tính cho người chơi (muốn tối thiểu điểm số)
def minimax(board, is_maximizing):
    
    # 1. BASE CASE: Kiểm tra trạng thái kết thúc và trả về điểm số
    if check_win(board, 'O'):  # AI ('O') thắng
        return 10
    if check_win(board, 'X'):  # Người chơi ('X') thắng
        return -10
    if check_tie(board):       # Hòa
        return 0

    # 2. RECURSION (Đệ quy)
    if is_maximizing:
        # Lượt của AI ('O') - tìm điểm số cao nhất (MAXIMIZE)
        best_score = -float('inf')  # Khởi tạo điểm số thấp nhất
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'O'
                score = minimax(board, False) # Chuyển sang lượt người chơi (Minimizing)
                board[i] = ' ' # Hoàn trả nước đi (Backtrack)
                best_score = max(best_score, score)
        return best_score
    else:
        # Lượt của Người chơi ('X') - tìm điểm số thấp nhất (MINIMIZE)
        best_score = float('inf')   # Khởi tạo điểm số cao nhất
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'X'
                score = minimax(board, True) # Chuyển sang lượt AI (Maximizing)
                board[i] = ' ' # Hoàn trả nước đi (Backtrack)
                best_score = min(best_score, score)
        return best_score

# Hàm chính để AI tìm nước đi tốt nhất
def find_best_move(board):
    best_score = -float('inf')
    best_move = -1

    for i in range(9):
        # Chỉ xét những ô trống
        if board[i] == ' ':
            # Thử nước đi
            board[i] = 'O'
            # Tính điểm số Minimax của nước đi đó
            score = minimax(board, False)
            # Hoàn trả nước đi
            board[i] = ' '
            
            # Nếu điểm số tốt hơn, cập nhật nước đi tốt nhất
            if score > best_score:
                best_score = score
                best_move = i
                
    return best_move
