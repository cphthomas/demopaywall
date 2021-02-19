
 exports.handler = async (event, context) => {
     const { type } = JSON.parse(event.body);
     const { user } = context.clientContext;
     const roles = user ? user.app_metadata.roles : false;
     //const { allowedRoles } = content[type];
     //console.log(roles);

  return {
    statusCode: 200,
    body: JSON.stringify(roles),
  };
};