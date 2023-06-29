function letMeCallYou()
{
    alert("Bazinga !!, you called letMeCallYou")
}

function is_valid_datalist_value(idDataList, inputValue)
{
    var option = document.querySelector("#" + idDataList + " option[value='" + inputValue + "']");
    if (option != null)
    {
        return option.value.length > 0;
    }

    return false ;
}

function doValidate() 
{
    if (is_valid_datalist_value('material_list', document.getElementById('material').value)) 
    {
      alert("Valid");
    } else 
    {
      alert("Invalid");
    }
}

function validate(value)
{
    const regEx = /^\d*\.?\d*$/ ;
    return regEx.test(value);
}

function doValidate1()
{
    if (validate(document.getElementById('input').value))
    {
        alert("Valid");
    }
    else 
    {
        alert("Invalid");
    }
}

function validate_blank(value)
{
    const regEx1 = /^\s*$/ ;
    return regEx1.test(value);
}

function doValidate2()
{
    if (validate_blank(document.getElementById('input1').value))
    {
        alert("Invalid");
    }
    else
    {
        alert("Valid");  
    }
}

//var panes = document.getElementById('panes')
//var panex = document.getElementById('panex')
let i = 0;

function AllocButton(){
    i++ ;
    var temp = document.getElementsByTagName("template")[0];
    //alert(temp)
    var clone = temp.content.cloneNode(true);
    //alert(clone)
    $(clone).appendTo('#panes');
    $('#panex').attr('id' , 'pane'+i);
    //alert(i)

    $(document).on("click","#removeallocbutton",function(){
        selectedid = $(this).parent().parent().parent().parent().parent().attr('id');
        //alert(selectedid)
        if (selectedid != 'pane1')
        {
            $('#'+selectedid).remove();
        }
    })
}

let j = 0;

function SuperButton(){
    j++;
    var temp = document.getElementsByTagName("template")[1];
    var clone = temp.content.cloneNode(true);
    $(clone).appendTo("#superpanes");
    $('#superpanex').attr('id', 'superpane'+j);
    //alert(j);

    $(document).on("click", "#removesuperbutton",function(){
        selectedid = $(this).parent().parent().parent().parent().parent().attr('id');
        //alert(selectedid)
        if(selectedid != 'superpane1')
        {
            $('#'+selectedid).remove();
        }
    })
}

var ThreadRoller = [
    {display: "RM01", value: "RM01"},
    {display: "RM02", value: "RM02"},
    {display: "RM03", value: "RM03"},
    {display: "RM04", value: "RM04"},
    {display: "RM05", value: "RM05"},
    {display: "RM06", value: "RM06"},
    {display: "RM07", value: "RM07"}
];

var Forging = [
    {display: "FM01", value: "FM01"},
    {display: "FM02", value: "FM02"},
    {display: "FM03", value: "FM03"},
    {display: "FM04", value: "FM04"},
    {display: "FM05", value: "FM05"},
    {display: "FM06", value: "FM06"},
    {display: "FM07", value: "FM07"}
];

var BtCutter = [
    {display: "BT01", value: "BT01"},
    {display: "BT02", value: "BT02"},
    {display: "BT03", value: "BT03"},
    {display: "BT04", value: "BT04"},
    {display: "BT05", value: "BT05"}
];


     $(document).on("change", ".parent_selection", function(){
    var parent = $(this).val(); 
    alert(parent);

    switch(parent){
        case 'rm' :
            list(ThreadRoller, this);
            break;
        case 'fm' :
            list(Forging, this);
            break;
        case 'bt' :
            list(BtCutter, this);
            break;
        default :
            $('#child_selection').html('');
            $('#child_selection').attr("disabled", true);
            break;
    }
});
    function list(array_list, obj){
    el = $(obj).parent().parent().find('select');
    for (var i = 0; i<el.length; i++){
        if (el[i].getAttribute('id') == 'child_selection') {
            $(el[i]).html("") // resset the options
            $(array_list).each(function (k){
                $(el[i]).append("<option value='"+array_list[k].value + "'>" + array_list[k].display + "</option>");
            });
        }
    }
}

$(document).on("change","#qty",function() {
    var qty = $(this).val();
    el = $(this).parent().parent().find('input');

    for(var i = 0; i< el.length;i++)
    {
        if (el[i].getAttribute('id') == 'qtykg') // any attribute could be used here
        {
            el[i].value = qty * 8/1000; //units 8g in KG	// multiply
        }
    }
});
