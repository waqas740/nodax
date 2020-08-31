'use strict';
const { <%= modelName %> } = require("<%= modelPath %>")

module.exports.get<%=pluralName %> = async (req, res, next) => {
    try {

        const { params: { id } } = req;
        let data = null;
        if (id) {
            data = await <%= modelName %>.findOne({
                where: {
                    id
                },
				 raw: true
            })
        }
        else {
            data = await <%= modelName %>.findAll({ raw: true})
        }
        <% if (view) { %>

            return res.render("<%= pluralName.toLowerCase() %>/<%= name.toLowerCase() %>_list", { data });

          <% }
        else {%>
            return res.status(200).json(data);
            <%  } %>


    } catch (error) {
		<% if (view) { %>
       next();
	    <% } else {%>
		  return res.status(400).json(error);
		 <% }%>
    }
}
module.exports.create<%= modelName %> = async (req, res, next) => {
    try {

        const { body: payload } = req;
        let resp = await <%= modelName %>.create(payload);
        <% if (view) { %>
            return res.redirect('/<%= pluralName.toLowerCase() %>');
            <% }
        else { %>
            return res.status(200).json(resp);
            <%  } %>


    } catch (error) {
      <% if (view) { %>
       next();
	    <% } else {%>
		  return res.status(400).json(error);
		 <% }%>
    }
}
module.exports.remove<%= modelName %> = async (req, res, next) => {
    try {

        const { params: { id } } = req;
        if (!id) {
            throw "Id is required to remove <%= modelName %> "
        }
        let resp = await <%= modelName %>.destroy({ where: { id } });
        <% if (view) { %>
            return res.redirect('/<%= pluralName.toLowerCase() %>');
            <% }
        else { %>
            return res.status(200).json(resp);
            <%  } %>


    } catch (error) {
     <% if (view) { %>
       next();
	    <% } else {%>
		  return res.status(400).json(error);
		 <% }%>
    }
}
<% if (view) { %>

    module.exports.edit<%= modelName %> = async (req, res, next) => {
        try {
    
            const { params: { id } } = req;
            if (!id) {
                throw "Id is required to edit <%= modelName %> "
            }
            const data = await <%= modelName %>.findOne({
                where: {
                    id
                },
				 raw: true
            })
            return res.render("<%= pluralName.toLowerCase() %>/<%= modelName.toLowerCase() %>_edit",{data})
        } catch (error) {
            next()
        }
    }
    
    module.exports.create<%= modelName %>Form = async (req, res, next) => {
        try {
        return res.render("<%= pluralName.toLowerCase() %>/<%= name.toLowerCase() %>_create")
        } catch (error) {
           next()
        }
    }
    

  <% }%>
module.exports.update<%= modelName %> = async (req, res, next) => {
    try {

        const { params: { id }, body: payload } = req;
        if (!id) {
            throw "Id is required to update <%= modelName %> "
        }
        let resp = await <%= modelName %>.update(payload, { where: { id } });

        <% if (view) { %>
            return res.redirect('/<%= pluralName.toLowerCase() %>');
            <% }
        else { %>
            return res.status(200).json(resp);
            <%  } %>

    } catch (error) {
      <% if (view) { %>
       next();
	    <% } else {%>
		  return res.status(400).json(error);
		 <% }%>
    }
    
}
