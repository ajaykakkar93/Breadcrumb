define( ["qlik","css!./style.css","css!https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"],
function (qlik) {
	return {
		initialProperties: {
            listItems: [],
			FieldList: []
        },
		definition : {
			type : "items",
			component : "accordion",
			items: {
						CrumList: {
							type: "array",
                            ref: "listItems",
                            label: "Crumb List",
                            itemTitleRef: "label",
                            allowAdd: true,
                            allowRemove: true,
                            addTranslation: "Add Item",
                            items: {
								label: {
									type: "string",
									ref: "label",
									label: "Label",
									expression: "optional"
								},
								Icon: {
									type: "string",
									ref: "Icon",
									label: "Icon",
									expression: "optional"
								},
								customCss: {
									type: "string",
									ref: "customCss",
									label: "Custom CSS",
									expression: "optional"
								},
								SheetID: {
									type: "string",
									ref: "SheetID",
									label: "Sheet ID",
									expression: "optional"
								},
								FieldList: {
									type: "array",
									ref: "FieldList",
									label: "Field List",
									itemTitleRef: "label",
									allowAdd: true,
									allowRemove: true,
									addTranslation: "Add field to clear",
									items: {
										label: {
											type: "string",
											ref: "label",
											label: "Field Name"
										}
									}
								}
								//end
                            }
						},
				
				settings: {
					uses: "settings",
					items: {
						customCss: {
							type: "string",
							ref: "customCss",
							label: "Custom CSS",
							expression: "optional"
						}
					}
				}
			}
		},
		support : {
			snapshot: false,
			export: false,
			exportData : false,
			fullscreen : false
		},
		paint: function ($element,layout) {
			var app=qlik.currApp(),
				config={
					"id":layout.qInfo.qId,
					"html":'<ul class="Bcrumb">',
					"css":layout.customCss
				};
			
			if($('#Style_'+config.id).length == 0){
				$('<style id="Style_'+config.id+'">div[tid='+config.id+'] .qv-object-nav>a {display: none;} </style>').appendTo('head');
			}

			$.each(layout.listItems,function(k,v){
				var label=v.label,icon=v.Icon,sheet=v.SheetID,css=v.customCss,id=v.cId,field=[];
				config.html+='<li id="'+id+'"><a class="BreadcrumsNav" style="'+ config.css + css +'" sheetid="'+sheet+'" href="javascript:"><i class="'+icon+'" aria-hidden="true"></i><span class="text">'+label+'</span></a></li>';
			});
			config.html+='</ul>';
			$element.html( config.html );
			$('a.BreadcrumsNav').click(function(){
				var sheet = $(this).attr('sheetid');
				qlik.navigation.gotoSheet(sheet);
			});
			$.each(layout.listItems,function(k,v){
				var label=v.label,icon=v.Icon,sheet=v.SheetID,css=v.customCss,id=v.cId,field=[];
				$('#'+id+'').click(function(){
					console.log('clicked clear');
					$.each(v.FieldList,function(k,v){
						app.field('['+v.label+']').clear().then(function(){
							console.log('done',v.label);
						});
					});
				});
			});
			//needed for export
			
			return qlik.Promise.resolve();
		}
			,resize:function ($element,layout) {}
	};

} );

