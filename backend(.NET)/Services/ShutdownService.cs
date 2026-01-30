using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using PeerGrid.Backend.Hubs;
using System.Threading;
using System.Threading.Tasks;

namespace PeerGrid.Backend.Services
{
    public class ShutdownService : IHostedService
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public ShutdownService(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            // Broadcast 'ForceLogout' to all connected clients
            await _hubContext.Clients.All.SendAsync("ForceLogout", cancellationToken);
        }
    }
}
