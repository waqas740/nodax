'use strict';
const router = require('express').Router();

const <%= name %>Ctrl = require('<%=controllerPath%>');

router.get('/:id', <%= name %>Ctrl.get<%= name %>s);

router.get('/', <%= name %>Ctrl.get<%= name %>s);


router.post('/', <%= name %>Ctrl.create<%= name %>);

router.put('/:id',<%= name %>Ctrl.update<%= name %>);

router.delete('/:id', <%= name %>Ctrl.remove<%= name %>);


module.exports = { prefix: "/<%= model %>", router };
