terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "brainacademy" {
  name     = "brainacademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "brainacademyAKSCluster" {
  name                = "brainacademyAKSCluster"
  location            = azurerm_resource_group.brainacademy.location
  resource_group_name = azurerm_resource_group.brainacademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "31223feb-f232-48cd-ba1c-7282b1061d33"
    client_secret = "MQk8Q~44wHSP~G3iwV28BhWQU_gmqD57kjJIhaCL"
  }
}