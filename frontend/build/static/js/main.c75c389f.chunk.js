(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{46:function(e,t,n){e.exports=n(89)},51:function(e,t,n){},52:function(e,t,n){},79:function(e,t){},82:function(e,t,n){},83:function(e,t,n){},88:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),o=n(38),r=n.n(o),c=(n(51),n(4)),i=n(5),m=n(2),l=n(1),u=(n(52),n(102)),d="https://real-chato.herokuapp.com",g=n(39),_=n.n(g);n(82);var f=function(e){var t=e.content,n=e.type;return t?s.a.createElement("div",{className:"alert_message ".concat("error"===n&&"error"," ").concat(t&&"alert_message_go_down")},t):s.a.createElement("div",{className:"alert_message"})},h=n(44);n(83);var p=function(e){var t=e.me,n=e.view_other_messages,o=e.POST_active_user,r=e.unseen_messages,c=e.length,i=Object(a.useState)(!1),m=Object(l.a)(i,2),u=m[0],d=m[1];return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{onClick:function(){return d(!u)},className:"unseen_msg_notify ".concat(0!==c&&"unseen_msg_notify_go_down")},c," New"),s.a.createElement("div",{className:"unseen_msgs ".concat(u&&"unseen_msgs_go_right")},0!==r.length&&r.map((function(e,a){return s.a.createElement("div",{key:a,onClick:function(){localStorage.setItem("active",e.his_messages[0].info.send_by._id),o(e.his_messages[0].info.send_by._id),n({info:{send_by:{_id:e.his_messages[0].info.send_by._id}},talking_to:{_id:t._id,username:t.username}}),d(!1)},className:"unseen_msg"},s.a.createElement("div",{className:"unseen_msg_user"},e.his_messages[0].info.send_by.username),s.a.createElement("p",{className:"unseen_msg_content"},e.his_messages[e.his_messages.length-1].info.content),s.a.createElement("div",{className:"unseen_msg_length"},e.his_messages.length))}))))},b=_()("".concat(d));var v=function(){var e=Object(a.useState)({}),t=Object(l.a)(e,2),n=t[0],o=t[1],r=Object(a.useState)([]),g=Object(l.a)(r,2),_=g[0],v=g[1],w=Object(a.useState)({}),E=Object(l.a)(w,2),y=E[0],j=E[1],O=Object(a.useState)(!1),S=Object(l.a)(O,2),N=S[0],k=S[1],T=Object(a.useState)({type:"",message:""}),C=Object(l.a)(T,2),I=C[0],R=C[1],D=Object(a.useState)([]),M=Object(l.a)(D,2),B=M[0],J=M[1],P=Object(a.useState)(""),W=Object(l.a)(P,2),A=W[0],z=W[1],x=Object(a.useState)(""),F=Object(l.a)(x,2),G=F[0],H=F[1],L=Object(a.useState)([]),U=Object(l.a)(L,2),V=U[0],$=U[1],q=Object(a.useState)({}),K=Object(l.a)(q,2),Q=K[0],X=K[1],Y=Object(a.useRef)();function Z(){var e=localStorage.getItem("token")||"";fetch("".concat(d,"/api/all_users"),{method:"GET",headers:{Authorization:"Bearer".concat(e)}}).then((function(e){return e.json()})).then((function(e){e.TokenError&&(localStorage.clear(),window.location.reload(!1)),e.users&&v(e.users)}))}function ee(e){fetch("".concat(d,"/api/active_user"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e})}).then((function(e){return e.json()})).then((function(e){e.active_user&&(j(e.active_user),function(e){var t=localStorage.getItem("token")||"";fetch("".concat(d,"/api/create_room"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer".concat(t)},body:JSON.stringify({userId:e})}).then((function(e){return e.json()})).then((function(e){e.TokenError&&(console.log("errorToken"),localStorage.clear(),window.location.reload(!1)),e.yourRoom&&(J([]),te(e.yourRoom._id),z(e.yourRoom._id)),e.newRoom&&(J([]),te(e.newRoom._id),z(e.newRoom._id))}))}(e.active_user._id))}))}function te(e){var t=localStorage.getItem("token")||"";fetch("".concat(d,"/api/room_messages"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer".concat(t)},body:JSON.stringify({roomId:e})}).then((function(e){return e.json()})).then((function(e){if(e.TokenError&&(console.log("errorToken"),localStorage.clear(),window.location.reload(!1)),e.RoomMessages){var t=[];e.RoomMessages.forEach((function(n,a){t.push({info:{send_by:{username:n.msg.send_by.username,_id:n.msg.send_by._id},content:n.msg.content,Date_created_at:n.msg.Date_created_at,Time_created_at:n.msg.Time_created_at,viewed:n.msg.viewed},talking_to:{username:e.talkingWith.username,_id:e.talkingWith._id},is_mine:n.isMsgMine})})),J(t)}}))}function ne(e){b.emit("view_message",e)}return Object(a.useEffect)((function(){return function(){var e=localStorage.getItem("token")||"";fetch("".concat(d,"/api/check_permission"),{method:"GET",headers:{Authorization:"Bearer".concat(e)}}).then((function(e){return e.json()})).then((function(e){e.TokenError&&(localStorage.clear(),window.location.reload(!1)),e.me&&(o(e.me),function(){var e=localStorage.getItem("token")||"";fetch("".concat(d,"/api/unseen_messages"),{method:"GET",headers:{Authorization:"Bearer".concat(e)}}).then((function(e){return e.json()})).then((function(e){if(e.TokenError&&(localStorage.clear(),window.location.reload(!1)),e.unseenMessages&&0!==e.unseenMessages.length){var t=[];e.unseenMessages.forEach((function(e){var n=[];e.noViewed_messages.forEach((function(t){n.push({info:{send_by:{_id:e.talked_to._id,username:e.talked_to.username},content:t.content}})})),t.push({his_messages:n})})),$(t)}}))}())}))}()}),[]),Object(a.useEffect)((function(){n&&(b.emit("user_connect",{user:n}),b.on("welcome",(function(e){R(Object(m.a)(Object(m.a)({},I),{},{message:e})),setTimeout((function(){return R({type:"",message:""})}),3e3)})),b.on("someoneConnected",(function(e){R(Object(m.a)(Object(m.a)({},I),{},{message:e})),setTimeout((function(){return R({type:"",message:""})}),3e3),Z()})),Z())}),[n]),Object(a.useEffect)((function(){Y.current.scrollTop=Y.current.scrollHeight}),[B]),b.off("setting_message").on("setting_message",(function(e){if(e.msg.is_mine=n._id===e.msg.info.send_by._id,y._id===e.msg.info.send_by._id)ne(e.msg),J([].concat(Object(i.a)(B),[e.msg]));else if(R({type:"",message:"New message"}),setTimeout((function(){return R({type:"",message:""})}),3e3),0!==V.length){var t=Object(i.a)(V),a=!1;t.map((function(t){if(e.msg.info.send_by._id===t.his_messages[0].info.send_by._id)return t.his_messages.push(e.msg),void(a=!0)})),a?($(t),a=!1):($([{his_messages:[e.msg]}].concat(Object(i.a)(V))),a=!1)}else $([{his_messages:[e.msg]}].concat(Object(i.a)(V)))})),Object(a.useEffect)((function(){var e=V.filter((function(e){return e.his_messages[0].info.send_by._id!==y._id}));$(e)}),[y]),b.off("msg_viewed").on("msg_viewed",(function(e){if(y._id===e.viewed_by._id){for(var t=Object(i.a)(B),a=0,s=t.length-1;s>=0&&20!==a;s--)t[s].info.send_by._id===n._id&&(t[s].info.viewed=e.bool_viewed,a++);J(t)}})),Object(a.useEffect)((function(){0!==Object.entries(n).length&&0!==Object.entries(y).length&&b.emit("isWriting",{writing:n,writing_to:y,is_writing:G})}),[G]),b.off("someoneWriting").on("someoneWriting",(function(e){if(e.is_writing)X(Object(m.a)(Object(m.a)({},Q),{},Object(c.a)({},e.writing._id,e.is_writing)));else{var t=Object(m.a)({},Q);delete t[e.writing._id],X(t)}})),n?s.a.createElement(s.a.Fragment,null,s.a.createElement(f,{content:I.message,type:I.type}),s.a.createElement(p,{me:n,view_other_messages:ne,POST_active_user:ee,unseen_messages:V,set_unseen_messages:$,length:V.length}),s.a.createElement("div",{onClick:function(){return k(!N)},className:"set_users_go_right"},N?"<":">"),s.a.createElement("div",{className:"main_app"},s.a.createElement("div",{className:"users ".concat(N&&"users_go_right")},s.a.createElement("div",{onClick:function(){localStorage.clear(),window.location.reload(!1)},className:"me"},n.username),s.a.createElement("div",{className:"users_list"},0!==_.length&&_.map((function(e){return s.a.createElement("div",{onClick:function(){localStorage.setItem("active",e._id),ee(e._id),ne({info:{send_by:{_id:e._id}},talking_to:{_id:n._id,username:n.username}}),k(!1)},key:e._id,className:"user"},s.a.createElement(u.a,{className:"avatar"}),e.is_connected&&s.a.createElement("div",{className:"connected"}),s.a.createElement("div",{className:"flex"},s.a.createElement("p",null,e.username),e._id in Q&&s.a.createElement("div",{className:"isWriting"},"is writing...")))})))),s.a.createElement("div",{className:"room"},s.a.createElement("div",{className:"room_header"},y&&s.a.createElement(s.a.Fragment,null,s.a.createElement(u.a,{className:"avatar"}),y.is_connected&&s.a.createElement("div",{className:"connected"}),s.a.createElement("p",null,y.username))),s.a.createElement("div",{ref:Y,className:"room_body"},0!==B.length&&B.map((function(e,t){return s.a.createElement("div",{key:t,className:"message ".concat(e.is_mine&&"msg_mine")},s.a.createElement("div",{className:"message_user"},e.info.send_by.username),s.a.createElement("p",null,e.info.content),s.a.createElement("div",{className:"time"},e.info.Time_created_at),e.is_mine&&s.a.createElement("div",{className:"msg_is_viewed ".concat(e.info.viewed&&"msg_viewed")},s.a.createElement(h.a,null)))}))),s.a.createElement("form",{onSubmit:function(e){return function(e){if(e.preventDefault(),G&&0!==Object.entries(y).length&&""!==A){console.log("send");var t={info:{send_by:{username:n.username,_id:n._id},content:G.trim(),Date_created_at:(new Date).toUTCString(),Time_created_at:"".concat((new Date).getHours(),":").concat((new Date).getMinutes()),viewed:!1},talking_to:{username:y.username,_id:y._id},is_mine:!0};J([].concat(Object(i.a)(B),[t])),b.emit("getting_message",{msg:t});var a=localStorage.getItem("token")||"";fetch("".concat(d,"/api/add_message"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer".concat(a)},body:JSON.stringify({roomId:A,content:G.trim()})}).then((function(e){return e.json()})).then((function(e){e.TokenError&&(console.log("errorToken"),localStorage.clear(),window.location.reload(!1))})),H("")}}(e)},className:"room_footer"},s.a.createElement("input",{onChange:function(e){return H(e.target.value)},type:"text",placeholder:"Send message...",value:G}),s.a.createElement("button",{type:"submit"},"Send"))))):s.a.createElement("div",null)};n(88);var w=function(){var e=Object(a.useState)({username:"",password:""}),t=Object(l.a)(e,2),n=t[0],o=t[1],r=Object(a.useState)({username:"",password:"",re_password:""}),i=Object(l.a)(r,2),u=i[0],g=i[1],_=Object(a.useState)(!1),h=Object(l.a)(_,2),p=h[0],b=h[1],v=Object(a.useState)({type:"",message:""}),w=Object(l.a)(v,2),E=w[0],y=w[1],j=Object(a.useState)(!1),O=Object(l.a)(j,2),S=O[0],N=O[1];function k(e){o(Object(m.a)(Object(m.a)({},n),{},Object(c.a)({},e.target.name,e.target.value)))}function T(e){g(Object(m.a)(Object(m.a)({},u),{},Object(c.a)({},e.target.name,e.target.value)))}return s.a.createElement(s.a.Fragment,null,s.a.createElement(f,{content:E.message,type:E.type}),s.a.createElement("div",{className:"logsign"},s.a.createElement("div",{className:"header"},"RealChat"),s.a.createElement("div",{className:"logsign_container"},s.a.createElement("form",{onSubmit:function(e){return function(e){e.preventDefault(),N(!0),fetch("".concat(d,"/api/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((function(e){return e.json()})).then((function(e){e.error&&(y({type:"error",message:e.error}),setTimeout((function(){return y({type:"",message:""})}),5e3),N(!1)),e.message&&(y({type:"success",message:e.message}),setTimeout((function(){return y({type:"",message:""})}),5e3),N(!1),localStorage.setItem("token",e.token),window.location.reload(!1),o({username:"",password:""}))}))}(e)},className:"login ".concat(p&&"hide_logsign")},s.a.createElement("input",{onChange:function(e){return k(e)},type:"text",name:"username",placeholder:"username...",value:n.username}),s.a.createElement("input",{onChange:function(e){return k(e)},type:"password",name:"password",placeholder:"password...",value:n.password}),s.a.createElement("button",{className:S?"btn btn_loading":"btn",type:"submit"},S?"Loding...":"Login")),s.a.createElement("form",{onSubmit:function(e){return function(e){e.preventDefault(),N(!0),fetch("".concat(d,"/api/register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)}).then((function(e){return e.json()})).then((function(e){e.error&&(y({type:"error",message:e.error}),setTimeout((function(){return y({type:"",message:""})}),5e3),N(!1)),e.message&&(y({type:"success",message:e.message}),setTimeout((function(){return y({type:"",message:""})}),5e3),N(!1),o({username:u.username,password:u.password}),g({username:"",password:"",re_password:""}),b(!1))}))}(e)},className:"register ".concat(!p&&"hide_logsign")},s.a.createElement("input",{onChange:function(e){return T(e)},type:"text",name:"username",placeholder:"username...",value:u.username}),s.a.createElement("input",{onChange:function(e){return T(e)},type:"password",name:"password",placeholder:"password...",value:u.password}),s.a.createElement("input",{onChange:function(e){return T(e)},type:"password",name:"re_password",placeholder:"Confirm password...",value:u.re_password}),s.a.createElement("button",{className:S?"btn btn_loading":"btn",type:"submit"},S?"Registering...":"Register"))),s.a.createElement("div",{onClick:function(){return b(!p)},className:"switcher"},p?"Already ":"don't ","have account?")))};var E=function(){var e=!!localStorage.getItem("token")||!1;return s.a.createElement("div",{className:"app"},e?s.a.createElement(v,null):s.a.createElement(w,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(E,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[46,1,2]]]);
//# sourceMappingURL=main.c75c389f.chunk.js.map