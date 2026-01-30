using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Security.Claims;

namespace PeerGrid.Backend.Hubs
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task SendMessageToGroup(string groupName, string user, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendSignal(string targetUserId, string signalData)
        {
            // Send to the specific user's group
            // signalData is a JSON string containing type and payload
            await Clients.Group($"User_{targetUserId}").SendAsync("ReceiveSignal", Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value, signalData);
        }

        public async Task JoinWebinar(string webinarId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Webinar_{webinarId}");
        }

        public async Task SendWebinarSignal(string webinarId, string signalData)
        {
            // Broadcast to the webinar group, excluding the sender
            await Clients.OthersInGroup($"Webinar_{webinarId}").SendAsync("ReceiveWebinarSignal", signalData);
        }
    }
}
