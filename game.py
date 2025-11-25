# game.py: Logic chạy game và tương tác với người dùng
import minimax_ai # Nhập các hàm AI từ file bên cạnh

# Biểu diễn bàn cờ (9 ô, được đánh số từ 1 đến 9 cho dễ chơi)
# ' ' = ô trống, 'X' = người chơi, 'O' = AI
board = [' '] * 9

# --- Hàm Hiển thị ---
def print_guide():
    """Hiển thị hướng dẫn đánh số trên bàn phím."""
    print("\n--- Bàn phím tương ứng với Bàn cờ ---")
    print("| 1 | 2 | 3 |")
    print("-------------")
    print("| 4 | 5 | 6 |")
    print("-------------")
    print("| 7 | 8 | 9 |")
    print("------------------------------------\n")

def print_board():
    """In ra bàn cờ hiện tại."""
    print('\n-------------')
    print('|', board[0], '|', board[1], '|', board[2], '|')
    print('-------------')
    print('|', board[3], '|', '|', board[4], '|', board[5], '|')
    print('-------------')
    print('|', board[6], '|', '|', board[7], '|', board[8], '|')
    print('-------------')

# --- Logic Lượt chơi ---
def player_turn():
    """Xử lý lượt đánh của người chơi ('X')."""
    while True:
        try:
            # Người chơi nhập số từ 1 đến 9
            move = int(input("Nhập ô bạn muốn đánh (1-9): ")) - 1
            
            # Kiểm tra nước đi hợp lệ
            if 0 <= move <= 8 and board[move] == ' ':
                board[move] = 'X'
                break
            else:
                print("Lỗi: Vui lòng nhập một số hợp lệ trong khoảng 1-9 và ô đó phải còn trống.")
        except ValueError:
            print("Lỗi: Vui lòng nhập một số nguyên.")

def ai_turn():
    """Xử lý lượt đánh của AI ('O')."""
    print("AI đang suy nghĩ...")
    
    # Gọi hàm tìm nước đi tốt nhất từ file minimax_ai
    move = minimax_ai.find_best_move(board)
    
    if move != -1:
        board[move] = 'O'
        print(f"AI đã đánh vào ô {move + 1}")
    else:
        # Trường hợp này chỉ xảy ra khi game đã hòa hoặc kết thúc (về mặt lý thuyết)
        pass

# --- Vòng Lặp Game Chính ---
def play_game():
    """Vòng lặp chạy chính của trò chơi."""
    print_guide()
    
    # Vòng lặp game
    while True:
        # 1. Lượt người chơi
        player_turn()
        print_board()
        
        # 2. Kiểm tra kết thúc sau lượt người chơi
        if minimax_ai.check_win(board, 'X'):
            print("🎉 CHÚC MỪNG! Bạn đã thắng AI! (Rất hiếm khi xảy ra đấy 😉)")
            break
        if minimax_ai.check_tie(board):
            print("🤝 Hòa cờ! Minimax AI quá mạnh mẽ.")
            break

        # 3. Lượt AI
        ai_turn()
        print_board()

        # 4. Kiểm tra kết thúc sau lượt AI
        if minimax_ai.check_win(board, 'O'):
            print("🤖 AI Thắng! Thuật toán Minimax đã phát huy tác dụng.")
            break
        if minimax_ai.check_tie(board):
            print("🤝 Hòa cờ! Minimax AI quá mạnh mẽ.")
            break
        
# Chạy trò chơi khi script được khởi động
if __name__ == "__main__":
    play_game()
