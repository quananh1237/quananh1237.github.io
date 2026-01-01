local Players = game:GetService("Players")
local lp = Players.LocalPlayer

-- === CÀI ĐẶT ID CỦA BẠN ===
local ANIM_IDS = {
    Walk = "122150855457006", -- ID dáng đi
    Run = "82598234841035"    -- ID dáng chạy
}

local function ApplyAnims()
    local char = lp.Character or lp.CharacterAdded:Wait()
    local animate = char:WaitForChild("Animate", 10)
    
    if animate then
        pcall(function()
            -- Thay đổi ID trong các StringValue của script Animate gốc
            animate.walk.WalkAnim.AnimationId = "rbxassetid://" .. ANIM_IDS.Walk
            animate.run.RunAnim.AnimationId = "rbxassetid://" .. ANIM_IDS.Run
            
            -- Ép nhân vật cập nhật lại động tác ngay lập tức
            local hum = char:FindFirstChildOfClass("Humanoid")
            if hum then
                -- Dừng các động tác cũ đang chạy để load dáng mới
                for _, track in pairs(hum:GetPlayingAnimationTracks()) do
                    track:Stop(0)
                end
            end
        end)
        print("✔ Đã áp dụng Animation Walk & Run mới!")
    end
end

-- Chạy ngay khi thực thi script
task.spawn(ApplyAnims)

-- Tự động chạy lại mỗi khi nhân vật hồi sinh (Reset)
lp.CharacterAdded:Connect(function()
    task.wait(1) -- Đợi nhân vật load xong hẳn
    ApplyAnims()
end)
