class Session
{
  constructor(id)
  {
    this.id = id;
    this.clients = new Set;
  }
  join(client)
  {
    if(client.session){
      throw new Error('client in session try again');
    }
    this.clients.add(client);
    client.session = this;
  }
  leave(client)
  {
    if (client.session !== this)
    {
      throw new Erro('Client not in session');
    }
    this.clients.delete(client);
    client.session = null;
  }
}
module.exports = Session;
