%% -*- mode: erlang -*-
%% -*- erlang-indent-level: 4;indent-tabs-mode: nil -*-
%% ex: ts=4 sw=4 et
%% Copyright 2011 Benjamin Nortier
%%
%%   Licensed under the Apache License, Version 2.0 (the "License");
%%   you may not use this file except in compliance with the License.
%%   You may obtain a copy of the License at
%%
%%       http://www.apache.org/licenses/LICENSE-2.0
%%
%%   Unless required by applicable law or agreed to in writing, software
%%   distributed under the License is distributed on an "AS IS" BASIS,
%%   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
%%   See the License for the specific language governing permissions and
%%   limitations under the License.

-module(node_home_redirect_resource).
-author('Benjamin Nortier <bjnortier@gmail.com>').
-export([init/1, 
	 to_html/2]).
-include_lib("webmachine/include/webmachine.hrl").

init([]) -> {ok, undefined}.

to_html(ReqData, Context) ->
    {ok, AuthModule} = application:get_env(node, auth_module),
    case AuthModule:session_username(ReqData) of
	undefined ->
	    {ok, Host} = application:get_env(node, host),
	    Location = Host ++ "/signin",
	    {{halt, 302}, wrq:set_resp_header("Location", Location, ReqData), Context};
	_Username ->
	    node_resource:redirect_to_designs_if_username_known(ReqData, Context)
    end.
